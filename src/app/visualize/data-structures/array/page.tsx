"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Button = ({
  children,
  onClick,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "destructive";
}) => {
  const base =
    "px-3 py-2 rounded-xl font-medium transition-colors duration-300 shadow text-sm sm:text-base";
  const styles =
    variant === "destructive"
      ? "bg-red-500 hover:bg-red-600 text-white"
      : "bg-blue-500 hover:bg-blue-600 text-white";
  return (
    <button className={`${base} ${styles}`} onClick={onClick}>
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

export default function ArrayVisualizerPage() {
  const [array, setArray] = useState<number[]>([1, 2, 3, 4]);
  const [value, setValue] = useState<string>("");
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

  const animateHighlight = async (targetIndex: number) => {
    setHighlightIndex(targetIndex);
    await new Promise((res) => setTimeout(res, 600));
    setHighlightIndex(null);
  };

  const handleInsert = async (position: "start" | "middle" | "end") => {
    if (!value || isNaN(Number(value))) return;
    const num = Number(value);
    const newArray = [...array];
    let index = 0;
    if (position === "start") index = 0;
    else if (position === "end") index = newArray.length;
    else index = Math.floor(newArray.length / 2);

    await animateHighlight(index);
    newArray.splice(index, 0, num);
    setArray(newArray);
  };

  const handleDelete = async (position: "start" | "middle" | "end") => {
    if (array.length === 0) return;
    const newArray = [...array];
    let index = 0;
    if (position === "start") index = 0;
    else if (position === "end") index = newArray.length - 1;
    else index = Math.floor(newArray.length / 2);

    await animateHighlight(index);
    newArray.splice(index, 1);
    setArray(newArray);
  };

  return (
    <div className="flex flex-col h-screen w-full p-2 sm:p-4 gap-4">
      {/* Top 80% - Canvas */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-inner flex items-center justify-center overflow-auto">
        <div className="flex gap-2 sm:gap-4 flex-wrap justify-center relative">
          <AnimatePresence>
            {array.map((item, index) => (
              <motion.div
                key={index + "-box"}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                className="flex flex-col items-center relative"
              >
                {/* Pointer Arrow */}
                {highlightIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -top-6 text-yellow-500 text-lg"
                  >
                    ⬇
                  </motion.div>
                )}
                <motion.div
                  animate={{
                    backgroundColor:
                      highlightIndex === index ? "#facc15" : "#3b82f6",
                  }}
                  transition={{ duration: 0.4 }}
                  className={`rounded-xl shadow-md w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-sm sm:text-xl font-bold text-white`}
                >
                  {item}
                </motion.div>
                <span className="text-[10px] sm:text-xs mt-1 text-gray-600 dark:text-gray-300">
                  {index}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom 20% - Controls */}
      <div className="h-[20%] shadow p-2 sm:p-4 flex flex-col gap-2 sm:gap-4">
        <div className="flex gap-2 items-center flex-wrap">
          <Input
            type="number"
            placeholder="Enter value"
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue(e.target.value)
            }
          />
          <Button onClick={() => handleInsert("start")}>Insert Start</Button>
          <Button onClick={() => handleInsert("middle")}>Insert Middle</Button>
          <Button onClick={() => handleInsert("end")}>Insert End</Button>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <Button variant="destructive" onClick={() => handleDelete("start")}>
            Delete Start
          </Button>
          <Button variant="destructive" onClick={() => handleDelete("middle")}>
            Delete Middle
          </Button>
          <Button variant="destructive" onClick={() => handleDelete("end")}>
            Delete End
          </Button>
        </div>
      </div>
    </div>
  );
}
