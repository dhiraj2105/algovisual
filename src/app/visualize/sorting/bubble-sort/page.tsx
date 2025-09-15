"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function BubbleSortVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isSorting, setIsSorting] = useState(false);

  // UI state for animations
  const [pointerIndex, setPointerIndex] = useState<number | null>(null);
  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);
  const [lastInserted, setLastInserted] = useState<number | null>(null);

  // Stats
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [pass, setPass] = useState(0);

  const addElement = async () => {
    if (inputValue.trim() !== "") {
      const value = Number(inputValue);
      setArray((a) => [...a, value]);
      setLastInserted(array.length); // highlight new index
      setInputValue("");
      await sleep(400);
      setLastInserted(null);
    }
  };

  const deleteElement = (index: number) => {
    if (isSorting) return;
    setArray((a) => a.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    if (isSorting) return;
    setArray([]);
    setComparisons(0);
    setSwaps(0);
    setPass(0);
    setPointerIndex(null);
    setComparing([]);
    setSwapping([]);
  };

  const bubbleSort = async () => {
    if (array.length <= 1 || isSorting) return;
    setIsSorting(true);
    const arr = [...array];
    setComparisons(0);
    setSwaps(0);

    for (let i = 0; i < arr.length - 1; i++) {
      setPass(i + 1);
      let swapped = false;
      for (let j = 0; j < arr.length - i - 1; j++) {
        setPointerIndex(j);
        setComparing([j, j + 1]);
        setComparisons((c) => c + 1);
        await sleep(500);

        if (arr[j] > arr[j + 1]) {
          setSwapping([j, j + 1]);
          await sleep(400);
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          setSwaps((s) => s + 1);
          swapped = true;
          await sleep(450);
          setSwapping([]);
        }

        setComparing([]);
        await sleep(200);
      }

      if (!swapped) break;
    }

    setPointerIndex(null);
    setIsSorting(false);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Top 80% Visualization with Counters */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-auto">
        {/* Counters */}
        <div className="flex gap-6 mb-6 text-lg font-semibold">
          <motion.div
            animate={{ scale: pass > 0 ? 1.1 : 1 }}
            className="px-3 py-1 bg-purple-200 dark:bg-purple-700 rounded-xl shadow"
          >
            Pass: {pass}
          </motion.div>
          <motion.div
            animate={{ scale: comparisons > 0 ? 1.1 : 1 }}
            className="px-3 py-1 bg-yellow-200 dark:bg-yellow-700 rounded-xl shadow"
          >
            Comparisons: {comparisons}
          </motion.div>
          <motion.div
            animate={{ scale: swaps > 0 ? 1.1 : 1 }}
            className="px-3 py-1 bg-green-200 dark:bg-green-700 rounded-xl shadow"
          >
            Swaps: {swaps}
          </motion.div>
        </div>

        {/* Array Row */}
        <div className="relative w-full max-w-5xl px-4">
          <div className="flex gap-4 flex-wrap justify-center items-end relative">
            {array.map((value, index) => {
              const isComparing = comparing.includes(index);
              const isSwapping = swapping.includes(index);
              const isPointer = pointerIndex === index;
              const isInserted = lastInserted === index;

              return (
                <div
                  key={index}
                  className="relative flex flex-col items-center"
                >
                  {/* Arrow pointer */}
                  <div className="h-6">
                    {isPointer && (
                      <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-2xl text-yellow-500"
                      >
                        ▲
                      </motion.div>
                    )}
                  </div>

                  <motion.div
                    layout
                    animate={{
                      scale: isComparing ? 1.1 : isInserted ? 1.15 : 1,
                      y: isSwapping ? (index === swapping[0] ? -18 : 18) : 0,
                      backgroundColor: isInserted
                        ? "#86efac"
                        : isComparing
                        ? "#fde047"
                        : "#ffffff",
                      boxShadow: isSwapping
                        ? "0 8px 24px rgba(0,0,0,0.25)"
                        : "0 4px 8px rgba(0,0,0,0.08)",
                    }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col items-center justify-center w-20 h-20 border rounded shadow-md cursor-pointer select-none"
                    onClick={() => deleteElement(index)}
                  >
                    <div className="text-lg font-semibold">{value}</div>
                    <div className="text-xs text-gray-500">[{index}]</div>
                    {(isComparing || isSwapping) && (
                      <motion.div
                        className="text-xs text-blue-500 mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {isSwapping ? "Swapping" : "Comparing"}
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom 20% Controls */}
      <div className="h-1/5 p-4 bg-white dark:bg-gray-800 rounded-t-2xl shadow flex flex-col gap-3">
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter element"
            className="border p-2 rounded w-32"
            disabled={isSorting}
          />
          <button
            onClick={addElement}
            disabled={isSorting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Add
          </button>
          <button
            onClick={bubbleSort}
            disabled={isSorting || array.length < 2}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Bubble Sort
          </button>
          <button
            onClick={clearAll}
            disabled={isSorting}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Clear
          </button>
        </div>

        <div className="text-xs text-gray-500">
          Click on a box to delete the element (only when not sorting).
        </div>
      </div>
    </div>
  );
}
