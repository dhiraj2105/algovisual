"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function MergeSortVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isSorting, setIsSorting] = useState(false);

  const [comparisons, setComparisons] = useState(0);
  const [placements, setPlacements] = useState(0);

  // For visualization
  const [leftArray, setLeftArray] = useState<number[]>([]);
  const [rightArray, setRightArray] = useState<number[]>([]);
  const [activeMergeIndex, setActiveMergeIndex] = useState<number | null>(null);
  const [leftPointer, setLeftPointer] = useState<number | null>(null);
  const [rightPointer, setRightPointer] = useState<number | null>(null);
  const [mergeBuffer, setMergeBuffer] = useState<number[]>([]);

  const addElement = () => {
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
    setPlacements(0);
    setLeftArray([]);
    setRightArray([]);
    setMergeBuffer([]);
    setLeftPointer(null);
    setRightPointer(null);
    setActiveMergeIndex(null);
  };

  const mergeSort = async (
    arr: number[],
    l: number,
    r: number,
  ): Promise<void> => {
    if (l >= r) return;
    const mid = Math.floor((l + r) / 2);
    await mergeSort(arr, l, mid);
    await mergeSort(arr, mid + 1, r);
    await merge(arr, l, mid, r);
  };

  const merge = async (arr: number[], l: number, m: number, r: number) => {
    const left = arr.slice(l, m + 1);
    const right = arr.slice(m + 1, r + 1);

    setLeftArray(left);
    setRightArray(right);
    setMergeBuffer([]);
    await sleep(500);

    let i = 0,
      j = 0;

    const buffer: number[] = [];

    while (i < left.length && j < right.length) {
      setComparisons((c) => c + 1);
      setLeftPointer(i);
      setRightPointer(j);
      await sleep(450);

      if (left[i] <= right[j]) {
        buffer.push(left[i]);
        i++;
      } else {
        buffer.push(right[j]);
        j++;
      }
      setMergeBuffer([...buffer]);
      await sleep(450);
    }

    while (i < left.length) {
      buffer.push(left[i++]);
      setMergeBuffer([...buffer]);
      await sleep(300);
    }

    while (j < right.length) {
      buffer.push(right[j++]);
      setMergeBuffer([...buffer]);
      await sleep(300);
    }

    // Write buffer back to main array with animation
    for (let x = 0; x < buffer.length; x++) {
      arr[l + x] = buffer[x];
      setArray([...arr]);
      setActiveMergeIndex(l + x);
      setPlacements((p) => p + 1);
      await sleep(400);
    }

    setLeftArray([]);
    setRightArray([]);
    setMergeBuffer([]);
    setLeftPointer(null);
    setRightPointer(null);
    setActiveMergeIndex(null);
  };

  const handleMergeSort = async () => {
    if (array.length <= 1 || isSorting) return;
    setIsSorting(true);
    const arrCopy = [...array];
    await mergeSort(arrCopy, 0, arrCopy.length - 1);
    setArray([...arrCopy]);
    setLeftArray([]);
    setRightArray([]);
    setMergeBuffer([]);
    setActiveMergeIndex(null);
    setIsSorting(false);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Counters */}
      <div className="flex gap-6 mt-6 justify-center text-lg font-semibold">
        <motion.div
          animate={{ scale: comparisons > 0 ? 1.1 : 1 }}
          className="px-3 py-1 bg-yellow-200 dark:bg-yellow-700 rounded-xl shadow"
        >
          Comparisons: {comparisons}
        </motion.div>
        <motion.div
          animate={{ scale: placements > 0 ? 1.1 : 1 }}
          className="px-3 py-1 bg-green-200 dark:bg-green-700 rounded-xl shadow"
        >
          Placements: {placements}
        </motion.div>
      </div>

      {/* Visualization */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 overflow-auto">
        {/* Left / Right split arrays */}
        <AnimatePresence>
          {leftArray.length > 0 && (
            <motion.div
              key="left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-2"
            >
              {leftArray.map((v, i) => (
                <div key={i} className="relative flex flex-col items-center">
                  {leftPointer === i && (
                    <div className="text-blue-500 text-xl">🔻</div>
                  )}
                  <motion.div
                    layout
                    className="w-14 h-14 bg-blue-100 dark:bg-blue-800 border flex items-center justify-center rounded shadow"
                  >
                    {v}
                  </motion.div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {rightArray.length > 0 && (
            <motion.div
              key="right"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-2"
            >
              {rightArray.map((v, i) => (
                <div key={i} className="relative flex flex-col items-center">
                  {rightPointer === i && (
                    <div className="text-purple-500 text-xl">🔻</div>
                  )}
                  <motion.div
                    layout
                    className="w-14 h-14 bg-purple-100 dark:bg-purple-800 border flex items-center justify-center rounded shadow"
                  >
                    {v}
                  </motion.div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Temporary merge buffer */}
        {mergeBuffer.length > 0 && (
          <div className="flex gap-2">
            {mergeBuffer.map((v, i) => (
              <motion.div
                key={i}
                layout
                animate={{ scale: 1.1 }}
                className="w-12 h-12 bg-green-100 dark:bg-green-800 border flex items-center justify-center rounded shadow"
              >
                {v}
              </motion.div>
            ))}
          </div>
        )}

        {/* Main Array */}
        <div className="flex gap-4 flex-wrap justify-center items-end relative">
          {array.map((value, index) => (
            <motion.div
              key={index}
              layout
              animate={{
                scale: activeMergeIndex === index ? 1.15 : 1,
                backgroundColor:
                  activeMergeIndex === index ? "#bbf7d0" : "#ffffff",
              }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center w-20 h-20 border rounded shadow-md cursor-pointer select-none"
              onClick={() => deleteElement(index)}
            >
              <div className="text-lg text-black font-semibold">{value}</div>
              <div className="text-xs text-gray-500">[{index}]</div>
            </motion.div>
          ))}
        </div>
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
            onClick={handleMergeSort}
            disabled={isSorting || array.length < 2}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Merge Sort
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
