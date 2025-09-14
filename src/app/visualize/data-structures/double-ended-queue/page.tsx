"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DequePage() {
  const [capacity, setCapacity] = useState<number | null>(null);
  const [slots, setSlots] = useState<(string | null)[]>([]);
  const [value, setValue] = useState("");
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

  const isFull =
    capacity !== null && slots.filter((x) => x !== null).length >= capacity;
  const isEmpty = slots.every((x) => x === null);

  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const enqueueFront = async () => {
    if (!value || isFull) return;
    const filled = slots.filter((x) => x !== null);

    // Animate pointer to front
    setHighlightIndex(0);
    await sleep(300);

    filled.unshift(value);
    if (filled.length > (capacity ?? 0)) filled.pop();

    setSlots([...filled, ...Array((capacity ?? 0) - filled.length).fill(null)]);
    setValue("");
    setHighlightIndex(null);
  };

  const enqueueRear = async () => {
    if (!value || isFull) return;
    const filled = slots.filter((x) => x !== null);

    // Animate pointer to rear
    setHighlightIndex(filled.length);
    await sleep(300);

    filled.push(value);
    if (filled.length > (capacity ?? 0)) filled.shift();

    setSlots([...filled, ...Array((capacity ?? 0) - filled.length).fill(null)]);
    setValue("");
    setHighlightIndex(null);
  };

  const dequeueFront = async () => {
    if (isEmpty) return;
    setHighlightIndex(0);
    await sleep(300);
    const filled = slots.filter((x) => x !== null);
    filled.shift();
    setSlots([...filled, ...Array((capacity ?? 0) - filled.length).fill(null)]);
    setHighlightIndex(null);
  };

  const dequeueRear = async () => {
    if (isEmpty) return;
    const filled = slots.filter((x) => x !== null);
    setHighlightIndex(filled.length - 1);
    await sleep(300);
    filled.pop();
    setSlots([...filled, ...Array((capacity ?? 0) - filled.length).fill(null)]);
    setHighlightIndex(null);
  };

  const destroyDeque = () => {
    setCapacity(null);
    setSlots([]);
    setValue("");
    setHighlightIndex(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        Double-Ended Queue (Deque) Visualizer
      </h1>

      {!capacity && (
        <div className="flex flex-col items-center gap-4">
          <input
            type="number"
            placeholder="Enter deque size"
            value={capacity ?? ""}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="border p-2 rounded w-48 text-center"
          />
          <button
            onClick={() => setSlots(Array(capacity ?? 5).fill(null))}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Create Deque
          </button>
        </div>
      )}

      {capacity && (
        <div className="flex flex-col items-center gap-6 flex-1 justify-center">
          {/* Deque Container */}
          <div
            className={`flex flex-col items-center p-4 border-4 rounded-2xl w-full max-w-3xl transition-colors duration-300 ${
              isFull
                ? "border-red-500"
                : isEmpty
                ? "border-yellow-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            <h2 className="text-xl font-semibold mb-2">Deque</h2>
            <div className="flex gap-2">
              <AnimatePresence>
                {slots.map((element, i) => (
                  <motion.div
                    key={i}
                    layout
                    animate={{ scale: highlightIndex === i ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                    className={`relative w-16 h-16 border-2 rounded-xl flex justify-center items-center text-lg font-semibold transition-colors duration-300 ${
                      highlightIndex === i
                        ? "bg-yellow-300"
                        : "bg-white dark:bg-gray-800"
                    }`}
                  >
                    {element ?? (
                      <span className="text-xs text-gray-400">empty</span>
                    )}
                    <span className="absolute -bottom-5 text-xs">{i}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="mt-2 text-sm">
              {isEmpty && (
                <span className="text-yellow-600">Deque is Empty</span>
              )}
              {isFull && <span className="text-red-600">Deque is Full</span>}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-3">
            <input
              type="text"
              placeholder="Value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="border p-2 rounded w-32"
            />
            <button
              onClick={enqueueFront}
              disabled={isFull || !value}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded"
            >
              Enqueue Front
            </button>
            <button
              onClick={enqueueRear}
              disabled={isFull || !value}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded"
            >
              Enqueue Rear
            </button>
            <button
              onClick={dequeueFront}
              disabled={isEmpty}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded"
            >
              Dequeue Front
            </button>
            <button
              onClick={dequeueRear}
              disabled={isEmpty}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded"
            >
              Dequeue Rear
            </button>
            <button
              onClick={destroyDeque}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Destroy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
