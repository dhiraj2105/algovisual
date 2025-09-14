"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

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
};

const Input = ({ value, onChange, placeholder, type = "text" }: InputProps) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
);

export default function LinearQueueVisualizerPage() {
  const [capacityInput, setCapacityInput] = useState<string>("5");
  const [capacity, setCapacity] = useState<number | null>(null);
  const [created, setCreated] = useState(false);

  // Slots represent fixed array for linear queue
  const [slots, setSlots] = useState<(number | null)[]>([]);
  const [front, setFront] = useState(0);
  const [rear, setRear] = useState(-1);
  const [size, setSize] = useState(0);

  const [value, setValue] = useState<string>("");
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [operation, setOperation] = useState<"enqueue" | "dequeue" | null>(
    null
  );
  const [message, setMessage] = useState<string | null>(null);

  const delayPerStep = 350; // ms per pointer step

  const isEmpty = size === 0;
  const isFull = capacity !== null ? size >= capacity : false;

  const createQueue = () => {
    const cap = Number(capacityInput);
    if (!cap || cap <= 0) {
      setMessage("Enter valid queue size > 0");
      setTimeout(() => setMessage(null), 1500);
      return;
    }
    setCapacity(cap);
    setSlots(Array(cap).fill(null));
    setFront(0);
    setRear(-1);
    setSize(0);
    setCreated(true);
  };

  const destroyQueue = () => {
    setCapacity(null);
    setSlots([]);
    setFront(0);
    setRear(-1);
    setSize(0);
    setCreated(false);
    setHighlightIndex(null);
    setOperation(null);
    setMessage(null);
  };

  // Move pointer step-by-step from start -> target (inclusive)
  const movePointer = async (
    start: number,
    target: number,
    op: "enqueue" | "dequeue"
  ) => {
    setOperation(op);
    const step = start <= target ? 1 : -1; // normally start <= target
    for (let i = start; step > 0 ? i <= target : i >= target; i += step) {
      setHighlightIndex(i);
      await sleep(delayPerStep);
    }
    // keep highlight on target briefly
    await sleep(200);
    setHighlightIndex(null);
    setOperation(null);
  };

  const handleEnqueue = async () => {
    if (!created) return setMessage("Create queue first");
    if (isFull) {
      setMessage("Queue is full");
      setTimeout(() => setMessage(null), 1200);
      return;
    }
    if (!value || isNaN(Number(value))) return;

    const num = Number(value);
    const targetIndex = rear + 1; // linear enqueue

    // For educational pointer, start from front (or 0 if empty)
    const startIndex = size === 0 ? 0 : front;

    await movePointer(startIndex, targetIndex, "enqueue");

    // Place element
    setSlots((s) => {
      const ns = [...s];
      ns[targetIndex] = num;
      return ns;
    });
    setRear(targetIndex);
    setSize((z) => z + 1);
    setValue("");
  };

  const handleDequeue = async () => {
    if (!created) return setMessage("Create queue first");
    if (isEmpty) {
      setMessage("Queue is empty");
      setTimeout(() => setMessage(null), 1200);
      return;
    }

    const targetIndex = front; // dequeue from front

    // pointer just highlight front for clarity
    await movePointer(front, targetIndex, "dequeue");

    // remove element
    setSlots((s) => {
      const ns = [...s];
      ns[targetIndex] = null;
      return ns;
    });

    setFront((f) => f + 1);
    setSize((z) => z - 1);

    // if queue becomes empty, reset pointers to allow reuse (linear queue semantics typically don't reset, but for clarity we reset)
    setTimeout(() => {
      setSlots((s) => {
        // if size becomes 0, normalize slots and indices for next operations
        if (size - 1 <= 0) {
          const cap = capacity || 0;
          setFront(0);
          setRear(-1);
          setSize(0);
          return Array(cap).fill(null);
        }
        return s;
      });
    }, 250);
  };

  return (
    <div className="flex flex-col h-screen w-full p-2 sm:p-4 gap-4">
      <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        {!created ? (
          <div className="w-full max-w-md bg-white rounded-2xl shadow p-4 flex flex-col gap-3">
            <div className="text-lg font-semibold">Create Linear Queue</div>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                value={capacityInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCapacityInput(e.target.value)
                }
                placeholder="Queue size e.g. 5"
              />
              <Button onClick={createQueue}>Create</Button>
              <Button
                variant="destructive"
                onClick={() => setCapacityInput("5")}
              >
                Reset
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              Linear queue uses a fixed buffer; enqueue happens at rear, dequeue
              at front.
            </div>
            {message && <div className="text-sm text-red-500">{message}</div>}
          </div>
        ) : (
          <div
            className={`border-4 rounded-xl p-4 flex flex-col gap-4 items-center justify-center w-full max-w-4xl bg-gray-50 dark:bg-gray-800 ${
              isFull
                ? "border-red-500"
                : isEmpty
                ? "border-yellow-400"
                : "border-gray-400"
            }`}
          >
            <div className="text-lg text-white font-semibold">
              Linear Queue (capacity: {capacity})
            </div>

            <div className="flex w-full justify-center gap-3 flex-wrap">
              <AnimatePresence>
                {slots.map((slot, index) => {
                  const isFilled = slot !== null;
                  const isHighlighted = highlightIndex === index;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 20,
                      }}
                      className="relative flex flex-col items-center"
                    >
                      {/* Arrow pointer */}
                      {isHighlighted && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`mb-1 text-2xl ${
                            operation === "enqueue"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          ⬇
                        </motion.div>
                      )}

                      <motion.div
                        animate={{
                          backgroundColor: isHighlighted
                            ? operation === "enqueue"
                              ? "#4ade80"
                              : "#f87171"
                            : isFilled
                            ? "#3b82f6"
                            : "#e5e7eb",
                        }}
                        transition={{ duration: 0.3 }}
                        className={`w-16 sm:w-20 h-12 sm:h-14 rounded-lg flex items-center justify-center text-white font-semibold shadow`}
                      >
                        {slot}
                      </motion.div>

                      {/* Front/Rear badges */}
                      <div className="flex gap-1 mt-1">
                        {index === front && size > 0 && (
                          <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                            F
                          </span>
                        )}
                        {index === rear && size > 0 && (
                          <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                            R
                          </span>
                        )}
                      </div>

                      <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                        {index}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="flex gap-2 text-xs text-white">
              <span>Front: {size === 0 ? "-" : front}</span>
              <span>Rear: {rear === -1 ? "-" : rear}</span>
              <span>
                Size: {size}/{capacity}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="h-[20%] bg-white rounded-2xl shadow p-3 flex flex-col gap-3">
        <div className="flex gap-2 items-center flex-wrap">
          <Input
            type="number"
            placeholder="Value to enqueue"
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue(e.target.value)
            }
          />
          <Button onClick={handleEnqueue} disabled={!created || isFull}>
            Enqueue
          </Button>
          <Button
            variant="destructive"
            onClick={handleDequeue}
            disabled={!created || isEmpty}
          >
            Dequeue
          </Button>
          <Button variant="destructive" onClick={destroyQueue}>
            Destroy
          </Button>
        </div>
        {message && <div className="text-sm text-red-500">{message}</div>}
      </div>
    </div>
  );
}
