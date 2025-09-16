"use client";
import { useState, useEffect, useRef } from "react";

const WhileLoopVisualizer = () => {
  const [limit, setLimit] = useState(10);
  const [counter, setCounter] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState("Start");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const maxLimit = 50;

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    if (!isNaN(newLimit) && newLimit > 0 && newLimit <= maxLimit) {
      setLimit(newLimit);
    } else if (e.target.value === "") {
      setLimit(0);
    }
  };

  const startVisualization = () => {
    setIsRunning(true);
    setStep("Initialization");
    setCounter(0);
  };

  const pauseVisualization = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetVisualization = () => {
    setIsRunning(false);
    setCounter(0);
    setStep("Start");
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (counter < limit) {
          setStep(`Executing Body (i = ${counter})`);
          setCounter((prevCounter) => prevCounter + 1);
        } else {
          setStep("Loop Finished");
          setIsRunning(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, limit, counter]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 text-gray-800 dark:text-gray-200">
      <h1 className="text-4xl font-bold mb-8">While Loop Visualizer</h1>

      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="mb-6">
          <label htmlFor="limit" className="text-lg font-medium mr-4">
            Loop Limit (max 50):
          </label>
          <input
            type="number"
            id="limit"
            value={limit}
            onChange={handleLimitChange}
            className="w-24 p-2 border rounded-md dark:bg-gray-700"
            max={maxLimit}
            disabled={isRunning}
          />
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={startVisualization}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            Start
          </button>
          <button
            onClick={pauseVisualization}
            disabled={!isRunning}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:bg-gray-400"
          >
            Pause
          </button>
          <button
            onClick={resetVisualization}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Reset
          </button>
        </div>

        <div className="font-mono text-lg bg-gray-200 dark:bg-gray-700 p-4 rounded-md">
          <p>
            <span
              className={
                step.includes("Initialization")
                  ? "text-green-500 dark:text-green-400 font-bold"
                  : ""
              }
            >
              let i = 0;
            </span>
          </p>
          <p>
            <span
              className={
                step.includes("Condition") || (counter < limit && isRunning)
                  ? "text-green-500 dark:text-green-400 font-bold"
                  : ""
              }
            >
              while (i &lt; {limit}) {"{"}
            </span>
          </p>
          <p className="pl-4">
            <span
              className={
                step.includes("Body")
                  ? "text-green-500 dark:text-green-400 font-bold"
                  : ""
              }
            >
              {" "}
              Loop Body
            </span>
          </p>
          <p className="pl-4">
            <span
              className={
                step.includes("Increment")
                  ? "text-green-500 dark:text-green-400 font-bold"
                  : ""
              }
            >
              i++;
            </span>
          </p>
          <p>{"}"}</p>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Visualization</h2>
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-medium">Current Step:</span>
            <span className="text-xl font-bold text-blue-500 dark:text-blue-400 ml-2">
              {step}
            </span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-medium">Variable i:</span>
            <span className="text-2xl font-bold text-blue-500 dark:text-blue-400 ml-2">
              {counter}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-6 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-6 rounded-full text-center text-white"
              style={{ width: `${(counter / limit) * 100}%` }}
            >
              {Math.round((counter / limit) * 100)}%
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Loop Body Action</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: limit }).map((_, i) => (
              <div
                key={i}
                className={`w-10 h-10 border-2 ${i < counter ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhileLoopVisualizer;
