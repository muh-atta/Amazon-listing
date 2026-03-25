/// <reference types="chrome"/>

import { useState, useEffect } from "react";
import './App.css';

interface itemsprops {
  link: string;
  image: string;
  title: string;
}

function App({
  link, image, title
}):itemsprops{
  const [statusText, setStatusText] = useState("Checking...");
  const [currentCount, setCurrentCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [isStarted, setIsStarted] = useState(false);

  const handleToggle = () => {
    setIsStarted(!isStarted);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
      chrome.tabs.sendMessage(tabs[0].id!, { action: isStarted ? "stop" : "start" });
    });
  };

  useEffect(() => {
    const listener = (msg: any) => {
      if (msg.type === "progress") {
        setCurrentCount(msg.current);
        setTotalCount(msg.total);
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab || !tab.url) return;

      const url = new URL(tab.url);
      const page = url.searchParams.get("page") || "1";
      setPageNumber(Number(page));

      const isAmazon = url.hostname.includes("amazon.");
      const isListing = url.pathname === "/s" && url.searchParams.has("k");

      setStatusText(isAmazon && isListing ? "amazon.com" : "Visit Amazon listing page");
      setIsStarted(false);
    });
  }, []);

  return (
    <div className="popup-container min-w-[380px] min-h-[220px] p-4 flex flex-col items-center bg-gray-100">
      <h2 className="text-lg font-bold text-center text-gray-800 mb-2">
        Amazon Listing Checker
      </h2>

      <div
        id="status"
        className={`w-full text-center font-bold rounded-lg shadow-md p-2 transition-colors
          ${statusText === "amazon.com" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
      >
        {statusText}
      </div>

      <div className="button-container mt-4 flex justify-center w-full">
        <button
          onClick={handleToggle}
          className={`px-5 py-2 font-bold text-white rounded-md transition-transform cursor-pointer
            ${isStarted ? "bg-gray-700" : "bg-blue-600 hover:bg-blue-700"} active:scale-95`}
        >
          {isStarted ? "Stop" : "Start"}
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-700">
        <span className="font-semibold">{currentCount}</span> of <span className="font-semibold">{totalCount}</span>
      </p>

      <p className="text-sm text-gray-500 mt-1">Page: {pageNumber}</p>
    
    </div>
  );
}

export default App;