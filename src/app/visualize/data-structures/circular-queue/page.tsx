"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

// --- Types ---
type QueueNode = number | null;

// --- Helper Components ---
const Button = ({
  children,
  onClick,
  variant = "default",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "destructive";
  disabled?: boolean;
}) => {
  const base =
    "w-full px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-gray-800";
  const styles = {
    default: "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400",
    destructive: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400",
  };
  return (
    <button
      className={`${base} ${styles[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Input = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-all duration-300"
  />
);

// --- Main Component ---
export default function CircularQueueVisualizer() {
  const [capacity, setCapacity] = useState(8);
  const [queue, setQueue] = useState<QueueNode[]>(Array(capacity).fill(null));
  const [front, setFront] = useState(-1);
  const [rear, setRear] = useState(-1);
  const [inputValue, setInputValue] = useState("");
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);

  const isFull = () =>
    (front === 0 && rear === capacity - 1) || front === rear + 1;
  const isEmpty = () => front === -1;

  const handleEnqueue = async () => {
    if (isFull()) {
      setOperation("Queue is Full");
      await new Promise((res) => setTimeout(res, 1000));
      setOperation(null);
      return;
    }
    if (!inputValue || isNaN(Number(inputValue))) return;
    const value = Number(inputValue);

    let newRear = rear;
    if (front === -1) {
      setFront(0);
      newRear = 0;
    } else if (rear === capacity - 1) {
      newRear = 0;
    } else {
      newRear = rear + 1;
    }

    setOperation(`Enqueue ${value} at index ${newRear}`);
    setHighlightIndex(newRear);
    await new Promise((res) => setTimeout(res, 500));

    const newQueue = [...queue];
    newQueue[newRear] = value;
    setQueue(newQueue);
    setRear(newRear);
    setInputValue("");
    setHighlightIndex(null);
    setOperation(null);
  };

  const handleDequeue = async () => {
    if (isEmpty()) {
      setOperation("Queue is Empty");
      await new Promise((res) => setTimeout(res, 1000));
      setOperation(null);
      return;
    }

    setOperation(`Dequeue from index ${front}`);
    setHighlightIndex(front);
    await new Promise((res) => setTimeout(res, 500));

    const newQueue = [...queue];
    newQueue[front] = null;
    setQueue(newQueue);

    if (front === rear) {
      setFront(-1);
      setRear(-1);
    } else if (front === capacity - 1) {
      setFront(0);
    } else {
      setFront(front + 1);
    }
    setHighlightIndex(null);
    setOperation(null);
  };

  const radius = 120;
  const angleStep = (2 * Math.PI) / capacity;

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-gray-900 p-4 gap-4">
      <header className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
          Circular Queue
        </h1>
      </header>

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center p-4 relative">
        <div
          style={{
            width: `${radius * 2 + 80}px`,
            height: `${radius * 2 + 80}px`,
          }}
          className="relative"
        >
          {queue.map((value, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const x = radius + radius * Math.cos(angle);
            const y = radius + radius * Math.sin(angle);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x,
                  y,
                  backgroundColor:
                    highlightIndex === index
                      ? "#facc15"
                      : value !== null
                        ? "#3b82f6"
                        : "#9ca3af",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
              >
                {value}
                <div className="absolute -bottom-6 text-xs text-gray-500 dark:text-gray-400">
                  {index}
                </div>
                {front === index && (
                  <div className="absolute top-0 -translate-y-full bg-yellow-400 text-black text-xs px-2 py-1 rounded">
                    Front
                  </div>
                )}
                {rear === index && (
                  <div className="absolute bottom-0 translate-y-full bg-green-400 text-black text-xs px-2 py-1 rounded">
                    Rear
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
        {operation && (
          <div className="absolute top-4 left-4 bg-gray-200 dark:bg-gray-700 p-2 rounded-lg text-sm">
            {operation}
          </div>
        )}
      </div>

      <footer className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">
              Value
            </h3>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
            />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">
              Capacity
            </h3>
            <Input
              value={String(capacity)}
              onChange={(e) => setCapacity(Number(e.target.value))}
              placeholder="Enter capacity"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleEnqueue} disabled={!inputValue}>
              Enqueue
            </Button>
            <Button variant="destructive" onClick={handleDequeue}>
              Dequeue
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
