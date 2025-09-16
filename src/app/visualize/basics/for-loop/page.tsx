"use client";
import { useState, useEffect, useRef } from "react";

const ForLoopVisualizer = () => {
  const [limit, setLimit] = useState(10);
  const [nestedLimit, setNestedLimit] = useState(5);
  const [counter, setCounter] = useState(0);
  const [nestedCounter, setNestedCounter] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState("Start");
  const [loopType, setLoopType] = useState("normal");
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

  const handleNestedLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    if (!isNaN(newLimit) && newLimit > 0 && newLimit <= maxLimit) {
      setNestedLimit(newLimit);
    } else if (e.target.value === "") {
      setNestedLimit(0);
    }
  };

  const startVisualization = () => {
    setIsRunning(true);
    setStep("Initialization");
    setCounter(0);
    setNestedCounter(0);
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
    setNestedCounter(0);
    setStep("Start");
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (loopType === "normal") {
          setCounter((prevCounter) => {
            if (prevCounter < limit) {
              setStep(`Executing Body (i = ${prevCounter})`);
              return prevCounter + 1;
            } else {
              setStep("Loop Finished");
              setIsRunning(false);
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
              }
              return prevCounter;
            }
          });
        } else {
          // Nested loop logic
          if (counter < limit) {
            if (nestedCounter < nestedLimit) {
              setStep(
                `Executing Inner Loop Body (i = ${counter}, j = ${nestedCounter})`,
              );
              setNestedCounter(nestedCounter + 1);
            } else {
              setCounter(counter + 1);
              setNestedCounter(0);
            }
          } else {
            setStep("Loop Finished");
            setIsRunning(false);
          }
        }
      }, 500);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, limit, nestedLimit, loopType, counter, nestedCounter]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 text-gray-800 dark:text-gray-200">
      <h1 className="text-4xl font-bold mb-8">For Loop Visualizer</h1>

      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="loopType" className="text-lg font-medium mr-4">
              Loop Type:
            </label>
            <select
              id="loopType"
              value={loopType}
              onChange={(e) => setLoopType(e.target.value)}
              className="p-2 border rounded-md bg-white dark:bg-gray-700"
              disabled={isRunning}
            >
              <option value="normal">Normal Loop</option>
              <option value="nested">Nested Loop</option>
            </select>
          </div>
          <div className="flex items-center">
            <label htmlFor="limit" className="text-lg font-medium mr-4">
              {loopType === "nested" ? "Outer Loop Limit:" : "Loop Limit:"}
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
          {loopType === "nested" && (
            <div className="flex items-center">
              <label htmlFor="nestedLimit" className="text-lg font-medium mr-4">
                Inner Loop Limit:
              </label>
              <input
                type="number"
                id="nestedLimit"
                value={nestedLimit}
                onChange={handleNestedLimitChange}
                className="w-24 p-2 border rounded-md dark:bg-gray-700"
                max={maxLimit}
                disabled={isRunning}
              />
            </div>
          )}
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
          {loopType === "normal" ? (
            <>
              <p>
                <span
                  className={
                    step.includes("Initialization")
                      ? "text-green-500 dark:text-green-400 font-bold"
                      : ""
                  }
                >
                  for (let i = 0;
                </span>
                <span
                  className={
                    step.includes("Condition") || (counter < limit && isRunning)
                      ? "text-green-500 dark:text-green-400 font-bold"
                      : ""
                  }
                >
                  {" "}
                  i &lt; {limit};
                </span>
                <span
                  className={
                    step.includes("Increment")
                      ? "text-green-500 dark:text-green-400 font-bold"
                      : ""
                  }
                >
                  {" "}
                  i++
                </span>
                ) {"{"}
              </p>
              <p className="pl-4">
                <span
                  className={
                    step.includes("Body")
                      ? "text-green-500 dark:text-green-400 font-bold"
                      : ""
                  }
                >
                  Loop Body
                </span>
              </p>
              <p>{"}"}</p>
            </>
          ) : (
            <>
              <p>
                <span
                  className={
                    counter < limit && isRunning
                      ? "text-green-500 dark:text-green-400 font-bold"
                      : ""
                  }
                >
                  for (let i = 0; i &lt; {limit}; i++)
                </span>
                {"{"}
              </p>
              <p className="pl-4">
                <span
                  className={
                    nestedCounter < nestedLimit && counter < limit && isRunning
                      ? "text-green-500 dark:text-green-400 font-bold"
                      : ""
                  }
                >
                  for (let j = 0; j &lt; {nestedLimit}; j++)
                </span>
                {"{"}
              </p>
              <p className="pl-8">
                <span
                  className={
                    step.includes("Inner Loop Body")
                      ? "text-green-500 dark:text-green-400 font-bold"
                      : ""
                  }
                >
                  Inner Loop Body
                </span>
              </p>
              <p className="pl-4">{"}"}</p>
              <p>{"}"}</p>
            </>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Visualization</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-lg font-medium">Current Step:</span>
              <span className="text-xl font-bold text-blue-500 dark:text-blue-400 ml-2">
                {step}
              </span>
            </div>
            <div>
              <span className="text-lg font-medium">Variable i:</span>
              <span className="text-2xl font-bold text-blue-500 dark:text-blue-400 ml-2">
                {counter}
              </span>
            </div>
            {loopType === "nested" && (
              <div>
                <span className="text-lg font-medium">Variable j:</span>
                <span className="text-2xl font-bold text-blue-500 dark:text-blue-400 ml-2">
                  {nestedCounter}
                </span>
              </div>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-6 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-6 rounded-full text-center text-white"
              style={{ width: `${(counter / limit) * 100}%` }}
            >
              {Math.round((counter / limit) * 100)}%
            </div>
          </div>
          {loopType === "nested" && (
            <div className="w-full bg-gray-200 rounded-full h-6 dark:bg-gray-700 mt-2">
              <div
                className="bg-green-600 h-6 rounded-full text-center text-white"
                style={{ width: `${(nestedCounter / nestedLimit) * 100}%` }}
              >
                {Math.round((nestedCounter / nestedLimit) * 100)}%
              </div>
            </div>
          )}
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

export default ForLoopVisualizer;
