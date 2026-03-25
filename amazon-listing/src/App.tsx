/// <reference types="chrome"/>

import { useState, useEffect } from "react";
import './App.css';

function App(){
  const [statusText, setStatusText] = useState("Checking...");
  const [currentCount, setCurrentCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [isStarted, setIsStarted] = useState(false);
  const [items, setItems] = useState<Array<any>>([]);
  const [isValidPage, setIsValidPage] = useState(false);

useEffect(() => {
  const listener = (msg: any) => {
    if (msg.type === "progress") {
      setCurrentCount(msg.current);
      setTotalCount(msg.total);
    }

    if (msg.type === "itemFetched") {
      setItems(prev => [...prev, msg.item]);
    }
  };

  chrome.runtime.onMessage.addListener(listener);

  return () => {
    chrome.runtime.onMessage.removeListener(listener);
  };
}, []);

  const handleToggle = () => {
  setIsStarted(prev => !prev);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
    const action = isStarted ? "stop" : "start"; 
    chrome.tabs.sendMessage(tabs[0].id!, { action });
  });
};

  useEffect(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab || !tab.url) return;

    const url = new URL(tab.url);
    const page = url.searchParams.get("page") || "1";
    setPageNumber(Number(page));

    const isAmazon = url.hostname.includes("amazon.");
    const isListing = url.pathname === "/s" && url.searchParams.has("k");

    const valid = isAmazon && isListing;

    setIsValidPage(valid);

    setStatusText(valid ? "amazon.com" : "Visit Amazon listing page");
    setIsStarted(false);
  });
}, []);

  return (
      <div className="w-[700px] min-h-[500px] bg-gray-100 p-3 flex flex-col">

  <h2 className="text-lg font-bold text-center text-gray-800 mb-2">
    Amazon Listing Checker
  </h2>

  <div
    className={`w-full text-center font-bold rounded-lg p-2 text-sm
    ${isValidPage ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
  >
    {statusText}
  </div>

  <button
    onClick={handleToggle}
    disabled={!isValidPage}
    className={`mt-3 py-2 rounded-md text-white font-semibold cursor-pointer
      ${!isValidPage ? "bg-gray-400 cursor-not-allowed" :
      isStarted ? "bg-gray-700" : "bg-blue-600 hover:bg-blue-700"}`}
  >
    {isStarted ? "Stop" : "Start"}
  </button>

  <div className="text-center mt-2 text-sm text-gray-700">
    {currentCount} of {totalCount}
  </div>

  <div className="text-center text-xs text-gray-500 mb-2">
    Page: {pageNumber}
  </div>

  {/* Scrollable grid */}
  <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[300px] pr-1">
    {items.map((item, index) => (
      <a
        key={index}
        href={item.link}
        target="_blank"
        rel="noreferrer"
        className="bg-white rounded shadow-sm hover:shadow-md transition p-1"
      >
        <img
          src={item.image}
          alt='Image is Loading'
          className="w-full h-40 object-cover rounded"
        />

        <p className="text-[10px] mt-3 font-semibold line-clamp-2 leading-tight pt-4">
  {item.title}
</p>
      </a>
    ))}
  </div>

</div>
  );
}

export default App;