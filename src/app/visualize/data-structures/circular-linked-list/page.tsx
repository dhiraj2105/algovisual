"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
type NodeType = { id: number; value: string };

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
export default function CircularLinkedListVisualizer() {
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [idCounter, setIdCounter] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [indexInput, setIndexInput] = useState("");
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);

  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const animateOperation = async (op: string, indexes: number[]) => {
    setOperation(op);
    for (const i of indexes) {
      setHighlightIndex(i);
      await sleep(400);
    }
    setHighlightIndex(null);
    setOperation(null);
  };

  const handleInsert = async (position: "head" | "tail" | "index") => {
    if (!inputValue) return;
    const newNode = { id: idCounter, value: inputValue };
    setIdCounter(idCounter + 1);

    if (position === "head") {
      await animateOperation("Inserting at Head", [0]);
      setNodes([newNode, ...nodes]);
    } else if (position === "tail") {
      await animateOperation(
        "Inserting at Tail",
        Array.from({ length: nodes.length }, (_, i) => i),
      );
      setNodes([...nodes, newNode]);
    } else {
      const index = parseInt(indexInput, 10);
      if (isNaN(index) || index < 0 || index > nodes.length) return;
      await animateOperation(
        `Inserting at index ${index}`,
        Array.from({ length: index + 1 }, (_, i) => i),
      );
      const newNodes = [...nodes];
      newNodes.splice(index, 0, newNode);
      setNodes(newNodes);
    }
    setInputValue("");
    setIndexInput("");
  };

  const handleDelete = async (position: "head" | "tail" | "index") => {
    if (nodes.length === 0) return;

    if (position === "head") {
      await animateOperation("Deleting Head", [0]);
      setNodes(nodes.slice(1));
    } else if (position === "tail") {
      await animateOperation(
        "Deleting Tail",
        Array.from({ length: nodes.length }, (_, i) => i),
      );
      setNodes(nodes.slice(0, -1));
    } else {
      const index = parseInt(indexInput, 10);
      if (isNaN(index) || index < 0 || index >= nodes.length) return;
      await animateOperation(
        `Deleting at index ${index}`,
        Array.from({ length: index + 1 }, (_, i) => i),
      );
      const newNodes = [...nodes];
      newNodes.splice(index, 1);
      setNodes(newNodes);
    }
    setIndexInput("");
  };

  const radius = 120;
  const angleStep = nodes.length > 0 ? (2 * Math.PI) / nodes.length : 0;

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-gray-900 p-4 gap-4">
      <header className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
          Circular Linked List
        </h1>
      </header>

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center p-4 relative">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          style={{ overflow: "visible" }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="5"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                className="fill-current text-gray-400 dark:text-gray-500"
              />
            </marker>
          </defs>
          {nodes.map((_, index) => {
            const nextIndex = (index + 1) % nodes.length;
            const startAngle = index * angleStep - Math.PI / 2;
            const endAngle = nextIndex * angleStep - Math.PI / 2;
            const startX = radius + 40 + radius * Math.cos(startAngle);
            const startY = radius + 40 + radius * Math.sin(startAngle);
            const endX = radius + 40 + radius * Math.cos(endAngle);
            const endY = radius + 40 + radius * Math.sin(endAngle);
            return (
              <line
                key={index}
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke="#9ca3af"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            );
          })}
        </svg>
        <div
          style={{
            width: `${radius * 2 + 80}px`,
            height: `${radius * 2 + 80}px`,
          }}
          className="relative"
        >
          <AnimatePresence>
            {nodes.map((node, index) => {
              const angle = index * angleStep - Math.PI / 2;
              const x = radius + radius * Math.cos(angle);
              const y = radius + radius * Math.sin(angle);
              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x,
                    y,
                    backgroundColor:
                      highlightIndex === index ? "#facc15" : "#3b82f6",
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute w-20 h-20 rounded-full flex flex-col items-center justify-center text-white font-bold text-lg shadow-md"
                >
                  <span>{node.value}</span>
                  <span className="text-xs mt-1">({index})</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {nodes.length === 0 && (
            <div className="text-gray-400">List is empty</div>
          )}
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
              Index (for Index operations)
            </h3>
            <Input
              value={indexInput}
              onChange={(e) => setIndexInput(e.target.value)}
              placeholder="Enter index"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => handleInsert("head")} disabled={!inputValue}>
              Insert Head
            </Button>
            <Button onClick={() => handleInsert("tail")} disabled={!inputValue}>
              Insert Tail
            </Button>
            <Button
              onClick={() => handleInsert("index")}
              disabled={!inputValue || !indexInput}
            >
              Insert at Index
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete("head")}
              disabled={nodes.length === 0}
            >
              Delete Head
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete("tail")}
              disabled={nodes.length === 0}
            >
              Delete Tail
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete("index")}
              disabled={nodes.length === 0 || !indexInput}
            >
              Delete at Index
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
