/// <reference types="chrome"/>

import './App.css';

function App(){

  return (
  <div className="w-[400px] min-h-[300px] bg-gray-100 p-4 flex flex-col gap-3">

    <h2 className="text-lg font-bold text-center text-gray-800">
      Amazon Listing Checker
    </h2>

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

    {/* Button */}
    <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition cursor-pointer">
      Search Now
    </button>

  </div>
);
}

export default App;