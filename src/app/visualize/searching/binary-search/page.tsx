// "use client";

// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

// export default function BinarySearchVisualizer() {
//   const [array, setArray] = useState<number[]>([]);
//   const [inputValue, setInputValue] = useState("");
//   const [searchValue, setSearchValue] = useState("");
//   const [isSearching, setIsSearching] = useState(false);

//   const [low, setLow] = useState<number | null>(null);
//   const [mid, setMid] = useState<number | null>(null);
//   const [high, setHigh] = useState<number | null>(null);
//   const [discardedRange, setDiscardedRange] = useState<number[]>([]);

//   const [comparisons, setComparisons] = useState(0);
//   const [resultIndex, setResultIndex] = useState<number | null>(null);
//   const [stepExplanation, setStepExplanation] = useState("");

//   const addElement = () => {
//     if (inputValue.trim() === "") return;
//     const newArray = [...array, Number(inputValue)].sort((a, b) => a - b);
//     setArray(newArray);
//     setInputValue("");
//   };

//   const deleteElement = (index: number) => {
//     if (isSearching) return;
//     setArray((a) => a.filter((_, i) => i !== index));
//   };

//   const clearAll = () => {
//     if (isSearching) return;
//     setArray([]);
//     setLow(null);
//     setMid(null);
//     setHigh(null);
//     setComparisons(0);
//     setResultIndex(null);
//     setStepExplanation("");
//     setDiscardedRange([]);
//     setSearchValue("");
//   };

//   const handleBinarySearch = async () => {
//     if (array.length === 0 || searchValue.trim() === "" || isSearching) return;
//     setIsSearching(true);
//     setComparisons(0);
//     setResultIndex(null);

//     let l = 0;
//     let r = array.length - 1;

//     while (l <= r) {
//       setLow(l);
//       setHigh(r);
//       const m = Math.floor((l + r) / 2);
//       setMid(m);
//       setStepExplanation(
//         `mid = Math.floor((${l} + ${r}) / 2) = ${m}, array[mid] = ${array[m]}`
//       );
//       setComparisons((c) => c + 1);
//       await sleep(800);

//       if (array[m] === Number(searchValue)) {
//         setResultIndex(m);
//         setStepExplanation(`✅ Found at index ${m}`);
//         break;
//       }

//       if (array[m] < Number(searchValue)) {
//         setStepExplanation(
//           `array[mid] (${array[m]}) < ${searchValue} → Move Right (low = mid + 1)`
//         );
//         setDiscardedRange(Array.from({ length: m - l + 1 }, (_, i) => i + l));
//         await sleep(600);
//         setDiscardedRange([]);
//         l = m + 1;
//       } else {
//         setStepExplanation(
//           `array[mid] (${array[m]}) > ${searchValue} → Move Left (high = mid - 1)`
//         );
//         setDiscardedRange(Array.from({ length: r - m + 1 }, (_, i) => i + m));
//         await sleep(600);
//         setDiscardedRange([]);
//         r = m - 1;
//       }
//       await sleep(700);
//     }

//     if (resultIndex === null) {
//       setStepExplanation(`❌ Element not found`);
//     }

//     setIsSearching(false);
//   };

//   return (
//     <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//       {/* Step Explanation */}
//       <AnimatePresence>
//         {stepExplanation && (
//           <motion.div
//             key={stepExplanation}
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0 }}
//             className="text-center text-sm sm:text-base p-2 bg-indigo-100 dark:bg-indigo-800 rounded mb-2 shadow"
//           >
//             {stepExplanation}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Counters */}
//       <div className="flex gap-6 justify-center text-lg font-semibold mb-4">
//         <motion.div
//           animate={{ scale: comparisons > 0 ? 1.1 : 1 }}
//           className="px-3 py-1 bg-yellow-200 dark:bg-yellow-700 rounded-xl shadow"
//         >
//           Comparisons: {comparisons}
//         </motion.div>
//         {resultIndex !== null && (
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             className="px-3 py-1 bg-green-200 dark:bg-green-700 rounded-xl shadow"
//           >
//             Found at index: {resultIndex}
//           </motion.div>
//         )}
//       </div>

//       {/* Array Visualization */}
//       <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-auto">
//         <div className="relative w-full max-w-5xl px-4">
//           <div className="flex gap-4 flex-wrap justify-center items-end relative">
//             {array.map((value, index) => {
//               const isLow = index === low;
//               const isMid = index === mid;
//               const isHigh = index === high;
//               const isDiscarded = discardedRange.includes(index);
//               const isFound = index === resultIndex;

//               return (
//                 <div
//                   key={index}
//                   className="relative flex flex-col items-center"
//                 >
//                   {/* Arrow pointers */}
//                   <div className="h-5 relative mb-1">
//                     {isLow && (
//                       <motion.div
//                         layoutId="low-arrow"
//                         className="text-blue-500 text-xs absolute -top-3"
//                       >
//                         ⬆ Low
//                       </motion.div>
//                     )}
//                     {isMid && (
//                       <motion.div
//                         layoutId="mid-arrow"
//                         className="text-purple-500 text-xs absolute -top-3"
//                       >
//                         ⬆ Mid
//                       </motion.div>
//                     )}
//                     {isHigh && (
//                       <motion.div
//                         layoutId="high-arrow"
//                         className="text-red-500 text-xs absolute -top-3"
//                       >
//                         ⬆ High
//                       </motion.div>
//                     )}
//                   </div>

//                   <motion.div
//                     layout
//                     animate={{
//                       scale: isFound ? 1.2 : isMid ? 1.1 : 1,
//                       backgroundColor: isFound
//                         ? "#bbf7d0"
//                         : isDiscarded
//                         ? "#e5e7eb"
//                         : isMid
//                         ? "#f3e8ff"
//                         : isLow
//                         ? "#dbeafe"
//                         : isHigh
//                         ? "#fee2e2"
//                         : "#ffffff",
//                       opacity: isDiscarded ? 0.5 : 1,
//                     }}
//                     transition={{ duration: 0.3 }}
//                     className="flex flex-col items-center justify-center w-20 h-20 border rounded shadow-md cursor-pointer select-none"
//                     onClick={() => deleteElement(index)}
//                   >
//                     <div className="text-lg font-semibold">{value}</div>
//                     <div className="text-xs text-gray-500">[{index}]</div>
//                   </motion.div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="h-1/5 p-4 bg-white dark:bg-gray-800 rounded-t-2xl shadow flex flex-col gap-3">
//         <div className="flex gap-2 items-center flex-wrap">
//           <input
//             type="number"
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             placeholder="Enter element"
//             className="border p-2 rounded w-32"
//             disabled={isSearching}
//           />
//           <button
//             onClick={addElement}
//             disabled={isSearching}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//           >
//             Add
//           </button>

//           <input
//             type="number"
//             value={searchValue}
//             onChange={(e) => setSearchValue(e.target.value)}
//             placeholder="Search element"
//             className="border p-2 rounded w-32"
//             disabled={isSearching}
//           />
//           <button
//             onClick={handleBinarySearch}
//             disabled={isSearching || array.length === 0}
//             className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
//           >
//             Binary Search
//           </button>
//           <button
//             onClick={clearAll}
//             disabled={isSearching}
//             className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
//           >
//             Clear
//           </button>
//         </div>
//         <div className="text-xs text-gray-500">
//           Array is auto-sorted. Click on a box to delete element (when not
//           searching).
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function BinarySearchVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState<number | "">("");
  const [low, setLow] = useState<number | null>(null);
  const [mid, setMid] = useState<number | null>(null);
  const [high, setHigh] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [stepExplanation, setStepExplanation] = useState("");
  const [resultIndex, setResultIndex] = useState<number | null>(null);
  const [discardedRange, setDiscardedRange] = useState<number[]>([]);

  // Generate a random sorted array
  const generateRandomSortedArray = () => {
    if (isSearching) return;
    const length = Math.floor(Math.random() * 6) + 6; // 6-12 elements
    const arr = Array.from(
      { length },
      () => Math.floor(Math.random() * 90) + 10,
    ).sort((a, b) => a - b);
    setArray(arr);
    setTarget("");
    resetState();
  };

  const resetState = () => {
    setLow(null);
    setMid(null);
    setHigh(null);
    setComparisons(0);
    setStepExplanation("");
    setResultIndex(null);
    setDiscardedRange([]);
  };

  const binarySearch = async (arr: number[], target: number) => {
    setIsSearching(true);
    let l = 0,
      h = arr.length - 1;

    while (l <= h) {
      setLow(l);
      setHigh(h);
      const m = Math.floor((l + h) / 2);
      setMid(m);
      setStepExplanation(`mid = Math.floor((${l} + ${h}) / 2) = ${m}`);
      await sleep(800);

      setComparisons((c) => c + 1);

      if (arr[m] === target) {
        setResultIndex(m);
        setStepExplanation(`✅ Found ${target} at index ${m}`);
        await sleep(600);
        break;
      } else if (arr[m] < target) {
        setStepExplanation(`${arr[m]} < ${target}, discard left half`);
        setDiscardedRange((prev) => [
          ...prev,
          ...Array.from({ length: m - l + 1 }, (_, i) => l + i),
        ]);
        await sleep(500);
        l = m + 1;
      } else {
        setStepExplanation(`${arr[m]} > ${target}, discard right half`);
        setDiscardedRange((prev) => [
          ...prev,
          ...Array.from({ length: h - m + 1 }, (_, i) => m + i),
        ]);
        await sleep(500);
        h = m - 1;
      }
      await sleep(500);
    }

    if (resultIndex === null) {
      setStepExplanation(`❌ Element not found`);
    }
    setIsSearching(false);
  };

  const handleSearch = async () => {
    if (target === "" || array.length === 0) return;
    resetState();
    await binarySearch(array, Number(target));
  };

  const clearAll = () => {
    if (isSearching) return;
    setArray([]);
    setTarget("");
    resetState();
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Top Visualization Section */}
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

        {/* Mid formula visualization */}
        {stepExplanation && (
          <motion.div
            key={stepExplanation}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-md font-mono bg-blue-100 dark:bg-blue-800 px-4 py-2 rounded-lg shadow"
          >
            {stepExplanation}
          </motion.div>
        )}

        {/* Array Display */}
        <div className="relative w-full max-w-5xl px-4">
          <div className="flex gap-4 flex-wrap justify-center items-end relative">
            {array.map((value, index) => {
              const isLow = index === low;
              const isMid = index === mid;
              const isHigh = index === high;
              const isDiscarded = discardedRange.includes(index);
              const isResult = index === resultIndex;

              return (
                <motion.div
                  key={index}
                  layout
                  animate={{
                    scale: isMid ? 1.2 : isLow || isHigh ? 1.1 : 1,
                    opacity: isDiscarded ? 0.4 : 1,
                    backgroundColor: isResult
                      ? "#4ade80"
                      : isMid
                        ? "#f472b6"
                        : isLow
                          ? "#60a5fa"
                          : isHigh
                            ? "#facc15"
                            : "#ffffff",
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative flex flex-col items-center justify-center w-20 h-20 border rounded shadow-md select-none"
                >
                  <div className="text-lg text-black font-semibold">
                    {value}
                  </div>
                  <div className="text-xs text-gray-500">[{index}]</div>

                  {/* Pointer arrows */}
                  {isLow && (
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: -22, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute -top-6 text-blue-500 text-sm font-bold"
                    >
                      ⬆ Low
                    </motion.div>
                  )}
                  {isMid && (
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: -22, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute -top-6 text-pink-500 text-sm font-bold"
                    >
                      ⬆ Mid
                    </motion.div>
                  )}
                  {isHigh && (
                    <motion.div
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: -22, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute -top-6 text-yellow-500 text-sm font-bold"
                    >
                      ⬆ High
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="h-1/5 p-4 bg-white dark:bg-gray-800 rounded-t-2xl shadow flex flex-col gap-3">
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="number"
            value={target}
            onChange={(e) =>
              setTarget(e.target.value ? Number(e.target.value) : "")
            }
            placeholder="Target element"
            className="border p-2 rounded w-32"
            disabled={isSearching}
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || array.length < 1}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Binary Search
          </button>
          <button
            onClick={generateRandomSortedArray}
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
          Binary Search requires a sorted array. Click Auto Generate for a quick
          demo.
        </div>
      </div>
    </div>
  );
}
