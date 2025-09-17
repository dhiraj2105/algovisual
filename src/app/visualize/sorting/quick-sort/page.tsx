"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function QuickSortVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isSorting, setIsSorting] = useState(false);

  const [pivotIndex, setPivotIndex] = useState<number | null>(null);
  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);

  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);

  const addElement = async () => {
    if (inputValue.trim() !== "") {
      setArray((a) => [...a, Number(inputValue)]);
      setInputValue("");
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
    setPivotIndex(null);
    setComparing([]);
    setSwapping([]);
  };

  const quickSort = async (
    arr: number[],
    low: number,
    high: number,
  ): Promise<void> => {
    if (low < high) {
      const pIndex = await partition(arr, low, high);
      await quickSort(arr, low, pIndex - 1);
      await quickSort(arr, pIndex + 1, high);
    }
  };

  const partition = async (
    arr: number[],
    low: number,
    high: number,
  ): Promise<number> => {
    const pivot = arr[high];
    setPivotIndex(high);
    let i = low - 1;

    for (let j = low; j < high; j++) {
      setComparing([j]);
      setComparisons((c) => c + 1);
      await sleep(400);
      if (arr[j] < pivot) {
        i++;
        setSwapping([i, j]);
        await sleep(300);
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        setSwaps((s) => s + 1);
        await sleep(350);
        setSwapping([]);
      }
    }
    setSwapping([i + 1, high]);
    await sleep(300);
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    setSwaps((s) => s + 1);
    await sleep(350);
    setSwapping([]);

    setPivotIndex(null);
    return i + 1;
  };

  const handleQuickSort = async () => {
    if (array.length <= 1 || isSorting) return;
    setIsSorting(true);
    const arrCopy = [...array];
    await quickSort(arrCopy, 0, arrCopy.length - 1);
    setArray([...arrCopy]);
    setComparing([]);
    setSwapping([]);
    setPivotIndex(null);
    setIsSorting(false);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-auto">
        <div className="flex gap-6 mb-6 text-lg font-semibold">
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

        <div className="relative w-full max-w-5xl px-4">
          <div className="flex gap-4 flex-wrap justify-center items-end relative">
            {array.map((value, index) => {
              const isPivot = pivotIndex === index;
              const isComparing = comparing.includes(index);
              const isSwapping = swapping.includes(index);

              return (
                <div
                  key={index}
                  className="relative flex flex-col items-center"
                >
                  <motion.div
                    layout
                    animate={{
                      scale: isComparing ? 1.1 : isPivot ? 1.15 : 1,
                      y: isSwapping ? (index === swapping[0] ? -18 : 18) : 0,
                      backgroundColor: isPivot
                        ? "#f472b6"
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
                    <div className="text-lg text-black font-semibold">
                      {value}
                    </div>
                    <div className="text-xs text-gray-500">[{index}]</div>
                    {isPivot && (
                      <div className="text-xs text-pink-600">Pivot</div>
                    )}
                    {isComparing && (
                      <div className="text-xs text-blue-500">Comparing</div>
                    )}
                    {isSwapping && (
                      <div className="text-xs text-green-600">Swapping</div>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

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
            onClick={handleQuickSort}
            disabled={isSorting || array.length < 2}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Quick Sort
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
