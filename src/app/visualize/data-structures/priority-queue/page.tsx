"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function PriorityQueuePage() {
  const [capacity, setCapacity] = useState<number | null>(null);
  const [slots, setSlots] = useState<{ value: string; priority: number }[]>([]);
  const [value, setValue] = useState("");
  const [priority, setPriority] = useState<number>(0);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

  const isFull = capacity !== null && slots.length >= capacity;
  const isEmpty = slots.length === 0;

  const enqueue = async () => {
    if (!value || isFull) return;
    const newElement = { value, priority };

    // Animate step-by-step pointer to insertion position (end)
    for (let i = 0; i <= slots.length; i++) {
      setHighlightIndex(i);
      await new Promise((res) => setTimeout(res, 300));
    }

    const updated = [...slots, newElement];
    // Sort by priority (min-priority queue)
    updated.sort((a, b) => a.priority - b.priority);

    setSlots(updated);
    setValue("");
    setPriority(0);
    setHighlightIndex(null);
  };

  const dequeue = async () => {
    if (isEmpty) return;

    setHighlightIndex(0); // Always remove highest priority element at index 0
    await new Promise((res) => setTimeout(res, 400));

    const updated = [...slots];
    updated.shift();
    setSlots(updated);
    setHighlightIndex(null);
  };

  const destroyQueue = () => {
    setCapacity(null);
    setSlots([]);
    setValue("");
    setPriority(0);
    setHighlightIndex(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        Priority Queue Visualizer
      </h1>

      {!capacity && (
        <div className="flex flex-col items-center gap-4">
          <input
            type="number"
            placeholder="Enter queue size"
            value={capacity ?? ""}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="border p-2 rounded w-48 text-center"
          />
          <button
            onClick={() => setCapacity(capacity ?? 5)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Create Queue
          </button>
        </div>
      )}

      {capacity && (
        <div className="flex flex-col items-center gap-6 flex-1 justify-center">
          {/* Queue Container */}
          <div
            className={`flex flex-col items-center p-4 border-4 rounded-2xl w-full max-w-3xl transition-colors duration-300 ${
              isFull
                ? "border-red-500"
                : isEmpty
                ? "border-yellow-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            <h2 className="text-xl font-semibold mb-2">Queue</h2>
            <div className="flex gap-2">
              {Array.from({ length: capacity }).map((_, i) => {
                const element = slots[i];
                return (
                  <motion.div
                    key={i}
                    className={`relative w-16 h-16 border-2 rounded-xl flex flex-col justify-center items-center text-lg font-semibold transition-colors duration-300 ${
                      highlightIndex === i
                        ? "bg-yellow-300"
                        : "bg-white dark:bg-gray-800"
                    }`}
                    animate={{ scale: highlightIndex === i ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {element ? (
                      <>
                        <span>{element.value}</span>
                        <span className="text-xs text-gray-500">
                          P:{element.priority}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">empty</span>
                    )}
                    <span className="absolute -bottom-5 text-xs">{i}</span>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-2 text-sm">
              {isEmpty && (
                <span className="text-yellow-600">Queue is Empty</span>
              )}
              {isFull && <span className="text-red-600">Queue is Full</span>}
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
            <input
              type="number"
              placeholder="Priority"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="border p-2 rounded w-24"
            />
            <button
              onClick={enqueue}
              disabled={isFull || !value}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded"
            >
              Enqueue
            </button>
            <button
              onClick={dequeue}
              disabled={isEmpty}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded"
            >
              Dequeue
            </button>
            <button
              onClick={destroyQueue}
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
