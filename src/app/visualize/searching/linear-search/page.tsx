"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function LinearSearchVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState<number | "">("");
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [comparisons, setComparisons] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [resultIndex, setResultIndex] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");

  const addElement = () => {
    if (inputValue.trim() !== "") {
      setArray((a) => [...a, Number(inputValue)]);
      setInputValue("");
    }
  };

  const deleteElement = (index: number) => {
    if (isSearching) return;
    setArray((a) => a.filter((_, i) => i !== index));
  };

  const generateRandomArray = () => {
    if (isSearching) return;
    const length = Math.floor(Math.random() * 6) + 6; // 6-12 elements
    const arr = Array.from(
      { length },
      () => Math.floor(Math.random() * 90) + 10,
    );
    setArray(arr);
    resetState();
  };

  const resetState = () => {
    setCurrentIndex(null);
    setComparisons(0);
    setResultIndex(null);
  };

  const linearSearch = async (arr: number[], target: number) => {
    setIsSearching(true);
    for (let i = 0; i < arr.length; i++) {
      setCurrentIndex(i);
      setComparisons((c) => c + 1);
      await sleep(500);

      if (arr[i] === target) {
        setResultIndex(i);
        await sleep(600);
        break;
      }
    }
    if (resultIndex === null) {
      setResultIndex(-1); // mark not found
    }
    setIsSearching(false);
  };

  const handleSearch = async () => {
    if (target === "" || array.length === 0) return;
    resetState();
    await linearSearch(array, Number(target));
  };

  const clearAll = () => {
    if (isSearching) return;
    setArray([]);
    setTarget("");
    resetState();
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Visualization Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-auto">
        {/* Stats */}
        <div className="flex gap-6 mb-4 text-lg font-semibold">
          <motion.div
            animate={{ scale: comparisons > 0 ? 1.1 : 1 }}
            className="px-3 py-1 bg-yellow-200 dark:bg-yellow-700 rounded-xl shadow"
          >
            Comparisons: {comparisons}
          </motion.div>
        </div>

        {/* Array Display */}
        <div className="relative w-full max-w-5xl px-4">
          <div className="flex gap-4 flex-wrap justify-center items-end relative">
            {array.map((value, index) => {
              const isCurrent = index === currentIndex;
              const isResult = index === resultIndex;

              return (
                <motion.div
                  key={index}
                  layout
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isResult
                      ? resultIndex === -1
                        ? "#f87171" // red if not found
                        : "#4ade80" // green if found
                      : isCurrent
                        ? "#fde047"
                        : "#ffffff",
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative flex flex-col items-center justify-center w-20 h-20 border rounded shadow-md cursor-pointer select-none"
                  onClick={() => deleteElement(index)}
                >
                  <div className="text-lg text-black font-semibold">
                    {value}
                  </div>
                  <div className="text-xs text-gray-500">[{index}]</div>

                  {/* Pointer arrow */}
                  {isCurrent && (
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: -22, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute -top-6 text-yellow-500 text-sm font-bold"
                    >
                      ⬆ Checking
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Not Found Message */}
        {resultIndex === -1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-red-500 font-semibold"
          >
            ❌ Element not found
          </motion.div>
        )}
        {resultIndex !== null && resultIndex >= 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-green-500 font-semibold"
          >
            ✅ Found at index {resultIndex}
          </motion.div>
        )}
      </div>

      {/* Controls */}
      <div className="h-1/5 p-4 bg-white dark:bg-gray-800 rounded-t-2xl shadow flex flex-col gap-3">
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter element"
            className="border p-2 rounded w-32"
            disabled={isSearching}
          />
          <button
            onClick={addElement}
            disabled={isSearching}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Add
          </button>
          <input
            type="number"
            value={target}
            onChange={(e) =>
              setTarget(e.target.value ? Number(e.target.value) : "")
            }
            placeholder="Target"
            className="border p-2 rounded w-32"
            disabled={isSearching}
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || array.length < 1}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Linear Search
          </button>
          <button
            onClick={generateRandomArray}
            disabled={isSearching}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Auto Generate
          </button>
          <button
            onClick={clearAll}
            disabled={isSearching}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Clear
          </button>
        </div>
        <div className="text-xs text-gray-500">
          Click on a box to delete the element (only when not searching).
        </div>
      </div>
    </div>
  );
}
