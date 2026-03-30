/// <reference types="chrome"/>

import { useEffect, useState } from "react";
import './App.css';

function App(){

  const [mode, setMode] = useState<"visible" | "hidden">("visible");

  // Load saved mode on popup open
  useEffect(() => {
  try {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get("scrapeMode", (data: { scrapeMode?: "visible" | "hidden" }) => {
        setMode(data.scrapeMode || "visible");
      });
    } else {
      console.log("Chrome API not available");
    }
  } catch (err) {
    console.error("Error accessing chrome storage:", err);
  }
}, []);

  // Handle mode change
  const handleModeChange = (value: "visible" | "hidden") => {
    setMode(value);

    chrome.storage.local.set({ scrapeMode: value }, () => {
      console.log("Mode saved:", value);
    });
  };

  const openSidebar = async () => {
    try {
      if (typeof chrome !== "undefined" && chrome.sidePanel) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.windowId) {
          chrome.sidePanel.open({ windowId: tab.windowId });
        }
      } else {
        console.error("Side panel API not available");
      }
    } catch (err) {
      console.error("Failed to open side panel:", err);
    }
  };

  return (
  <div className="w-[400px] min-h-[320px] bg-gray-100 p-4 flex flex-col gap-4">

    <h2 className="text-lg font-bold text-center text-gray-800">
      Amazon Listing Checker
    </h2>

    {/* Dropdown */}
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">
        Select Platform
      </label>
      <select
        defaultValue="amazon"
        className="w-full border rounded-md px-3 py-2 text-black focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <option value="amazon">Amazon</option>
        <option value="daraz">Daraz</option>
        <option value="imtiaz">Imtiaz</option>
      </select>
    </div>

    {/* Mode Toggle */}
    <div>
      <label className="text-sm font-medium mb-3 block">
        Select Mode
      </label>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-black cursor-pointer">
          <input
            type="radio"
            name="mode"
            value="visible"
            checked={mode === "visible"}
            onChange={() => handleModeChange("visible")}
          />
          Visible (Screenshot)
        </label>

        <label className="flex items-center gap-2 text-black cursor-pointer">
          <input
            type="radio"
            name="mode"
            value="hidden"
            checked={mode === "hidden"}
            onChange={() => handleModeChange("hidden")}
          />
          Hidden (Fast)
        </label>
      </div>
    </div>

    {/* Search Field */}
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">
        Search
      </label>
      <input
        type="text"
        placeholder="e.g. shoes, laptop..."
        className="w-full border rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Button */}
    <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition cursor-pointer">
      Search Now
    </button>
    
    <button 
      onClick={openSidebar}
      className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transition cursor-pointer flex items-center justify-center gap-2"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
      View Saved Products
    </button>

  </div>
);
}

export default App;