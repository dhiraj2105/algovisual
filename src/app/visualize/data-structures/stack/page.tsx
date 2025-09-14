"use client";

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Small helpers
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Simple reusable UI components (extract to /components/ui later)
const Button = ({
  children,
  onClick,
  disabled = false,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
}) => {
  const base =
    "px-3 py-2 rounded-xl font-medium transition-colors duration-200 shadow text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed";
  const styles =
    variant === "destructive"
      ? "bg-red-500 hover:bg-red-600 text-white"
      : "bg-blue-500 hover:bg-blue-600 text-white";
  return (
    <button
      className={`${base} ${styles}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

type InputProps = {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
};

const Input = ({
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: InputProps) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
  />
);

export default function StackVisualizerPage() {
  // Stack configuration
  const [capacityInput, setCapacityInput] = useState<string>("5");
  const [capacity, setCapacity] = useState<number | null>(null); // max size
  const [created, setCreated] = useState(false);

  // Stack state
  const [stack, setStack] = useState<number[]>([]);
  const [value, setValue] = useState<string>("");

  // Visualization state
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null); // actual index in stack (0..N-1) or N for placeholder
  const [operation, setOperation] = useState<"push" | "pop" | "peek" | null>(
    null
  );
  const [message, setMessage] = useState<string | null>(null);

  const isEmpty = stack.length === 0;
  const isFull = capacity !== null ? stack.length >= capacity : false;

  const createStack = () => {
    const cap = Number(capacityInput);
    if (!cap || cap <= 0) {
      setMessage("Please enter a valid stack size (greater than 0)");
      setTimeout(() => setMessage(null), 1800);
      return;
    }
    setCapacity(cap);
    setStack([]);
    setCreated(true);
    setMessage(null);
  };

  const resetStack = () => {
    setStack([]);
    setCapacity(null);
    setCreated(false);
    setHighlightIndex(null);
    setOperation(null);
  };

  // Show arrow over actualIndex. We render a placeholder at visual index 0 representing actualIndex = stack.length
  const animateHighlight = async (
    actualIndex: number,
    op: "push" | "pop" | "peek"
  ) => {
    setOperation(op);
    setHighlightIndex(actualIndex);
    await sleep(700); // slower so user can follow
    if (op !== "peek") setHighlightIndex(null);
    setOperation(null);
  };

  const handlePush = async () => {
    if (!created) return setMessage("Create stack first");
    if (isFull) {
      setMessage("Stack is full");
      setTimeout(() => setMessage(null), 1200);
      return;
    }
    if (!value || isNaN(Number(value))) return;

    const num = Number(value);
    // target actual index is current length
    const targetIndex = stack.length;
    await animateHighlight(targetIndex, "push");

    // push after highlight
    setStack((s) => [...s, num]);
    setValue("");
  };

  const handlePop = async () => {
    if (!created) return setMessage("Create stack first");
    if (isEmpty) {
      setMessage("Stack is empty");
      setTimeout(() => setMessage(null), 1200);
      return;
    }
    const targetIndex = stack.length - 1;
    await animateHighlight(targetIndex, "pop");
    setStack((s) => {
      const ns = [...s];
      ns.pop();
      return ns;
    });
  };

  const handlePeek = async () => {
    if (!created) return setMessage("Create stack first");
    if (isEmpty) {
      setMessage("Stack is empty");
      setTimeout(() => setMessage(null), 1200);
      return;
    }
    const topIndex = stack.length - 1;
    await animateHighlight(topIndex, "peek");
    setMessage(`Top value: ${stack[stack.length - 1]}`);
    setTimeout(() => setMessage(null), 1400);
  };

  const handleClear = async () => {
    if (!created) return;
    if (isEmpty) return;
    // animate pops from top to bottom
    for (let i = stack.length - 1; i >= 0; i--) {
      await animateHighlight(i, "pop");
      setStack((s) => {
        const ns = [...s];
        ns.pop();
        return ns;
      });
      await sleep(120);
    }
  };

  // Visual list: first element is a placeholder representing next free slot (actualIndex = stack.length)
  // then the stack elements in reverse order (top first)
  const visualList: (number | null)[] = [null, ...stack.slice().reverse()];

  return (
    <div className="flex flex-col h-screen w-full p-2 sm:p-4 gap-4 ">
      {/* Top area: Stack container */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        {!created ? (
          <div className="w-full max-w-md rounded-2xl shadow p-4 flex flex-col gap-3 bg-white">
            <div className="text-lg font-semibold">Create Stack</div>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                value={capacityInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCapacityInput(e.target.value)
                }
                placeholder="Stack size e.g. 5"
              />
              <Button onClick={createStack}>Create</Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setCapacityInput("5");
                }}
              >
                Reset
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              After creating, use Push/Pop/Peek to interact with the stack. Max
              size will be enforced.
            </div>
            {message && <div className="text-sm text-red-500">{message}</div>}
          </div>
        ) : (
          <div
            className={`border-4 rounded-xl w-64 sm:w-90 h-[70%] flex flex-col items-center relative p-3 ${
              isFull
                ? "border-red-500"
                : isEmpty
                ? "border-yellow-400"
                : "border-gray-400"
            } `}
          >
            <div className="absolute top-2 left-1/2 -translate-x-1/2 font-semibold text-gray-700 dark:text-gray-200">
              Stack (capacity: {capacity})
            </div>

            {/* Visual column - top is at small index 1 (visualList[1]) */}
            <div className="flex flex-col items-center w-full overflow-auto pt-8 pb-4 gap-2">
              <AnimatePresence>
                {visualList.map((item, vi) => {
                  const actualIndex = stack.length - vi; // placeholder vi=0 -> actualIndex = stack.length
                  const isPlaceholder = vi === 0;
                  const isHighlighted =
                    highlightIndex !== null && highlightIndex === actualIndex;

                  return (
                    <motion.div
                      key={vi + "-slot"}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 22,
                      }}
                      className="w-full flex items-center justify-center relative"
                    >
                      {/* Arrow pointer */}
                      {isHighlighted && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.25 }}
                          className={`absolute -top-7 text-2xl ${
                            operation === "push"
                              ? "text-green-500"
                              : operation === "pop"
                              ? "text-red-500"
                              : "text-yellow-500"
                          }`}
                        >
                          ⬇
                        </motion.div>
                      )}

                      {/* Slot box */}
                      {isPlaceholder ? (
                        <div
                          className={`w-24 sm:w-28 h-10 sm:h-12 rounded-lg flex items-center justify-center border-2 border-dashed ${
                            isHighlighted
                              ? "bg-green-100 border-green-400"
                              : "border-gray-300"
                          }`}
                        >
                          <span className="text-sm text-gray-500">(top)</span>
                        </div>
                      ) : (
                        <motion.div
                          animate={{
                            backgroundColor: isHighlighted
                              ? operation === "push"
                                ? "#4ade80"
                                : operation === "pop"
                                ? "#f87171"
                                : "#facc15"
                              : "#3b82f6",
                          }}
                          transition={{ duration: 0.35 }}
                          className="w-24 sm:w-28 h-10 sm:h-12 rounded-lg flex items-center justify-center text-white font-semibold"
                        >
                          {item}
                        </motion.div>
                      )}

                      {/* Index on right side */}
                      <span className="absolute right-[5rem] text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        {actualIndex}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Bottom badges */}
            <div className="absolute bottom-3 left-3 text-xs px-2 py-1 rounded">
              Size: {stack.length}/{capacity}
            </div>
            {isFull && (
              <div className="absolute bottom-3 right-3 text-xs px-2 py-1 rounded bg-red-100 text-red-700">
                Full
              </div>
            )}
            {isEmpty && (
              <div className="absolute bottom-3 right-3 text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                Empty
              </div>
            )}

            {/* Controls overlaid (small on top of visual for compactness) */}
          </div>
        )}
      </div>

      {/* Controls area */}
      <div className="h-[20%] rounded-2xl shadow p-3 sm:p-4 flex flex-col gap-3">
        <div className="flex gap-2 items-center flex-wrap">
          <Input
            type="number"
            placeholder="Value to push"
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue(e.target.value)
            }
          />
          <Button onClick={handlePush} disabled={!created || isFull}>
            Push
          </Button>
          <Button
            variant="destructive"
            onClick={handlePop}
            disabled={!created || isEmpty}
          >
            Pop
          </Button>
          <Button onClick={handlePeek} disabled={!created || isEmpty}>
            Peek
          </Button>
          <Button
            variant="destructive"
            onClick={handleClear}
            disabled={!created || isEmpty}
          >
            Clear
          </Button>
          <div className="flex-1" />
          <Button variant="destructive" onClick={resetStack}>
            Destroy
          </Button>
        </div>
        {message && <div className="text-sm text-red-500">{message}</div>}
      </div>
    </div>
  );
}
