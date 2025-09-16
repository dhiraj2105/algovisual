"use client";
import { useState, useEffect, useRef } from "react";

interface SelectionSortStep {
  array: number[];
  i: number | null;
  j: number | null;
  min_idx: number | null;
  phase: string;
}

const SelectionSortVisualizer = () => {
  const [array, setArray] = useState([5, 3, 8, 4, 2]);
  const [visualization, setVisualization] = useState<SelectionSortStep | null>(
    null,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [generator, setGenerator] =
    useState<Generator<SelectionSortStep> | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newArray = e.target.value
      .split(",")
      .map((n) => parseInt(n.trim(), 10))
      .filter((n) => !isNaN(n));
    setArray(newArray);
  };

  function* selectionSort(arr: number[]): Generator<SelectionSortStep> {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      let min_idx = i;
      for (let j = i + 1; j < n; j++) {
        yield { array: [...arr], i, j, min_idx, phase: "compare" };
        if (arr[j] < arr[min_idx]) {
          min_idx = j;
        }
      }
      [arr[i], arr[min_idx]] = [arr[min_idx], arr[i]];
      yield { array: [...arr], i, j: null, min_idx, phase: "swap" };
    }
    yield { array: [...arr], i: null, j: null, min_idx: null, phase: "done" };
  }

  const startVisualization = () => {
    setIsRunning(true);
    const gen = selectionSort([...array]);
    setGenerator(gen);
  };

  const pauseVisualization = () => {
    setIsRunning(false);
  };

  const resetVisualization = () => {
    setIsRunning(false);
    setVisualization(null);
    setGenerator(null);
  };

  useEffect(() => {
    if (isRunning && generator) {
      intervalRef.current = setInterval(() => {
        const next = generator.next();
        if (next.done) {
          setIsRunning(false);
        } else {
          setVisualization(next.value);
        }
      }, 500);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, generator]);

  const getBarColor = (index: number) => {
    if (!visualization) return "bg-blue-500";
    const { i, j, min_idx, phase } = visualization;
    if (index === i && phase === "swap") return "bg-green-500";
    if (index === min_idx) return "bg-red-500";
    if (index === j) return "bg-yellow-500";
    return "bg-blue-500";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 text-gray-800 dark:text-gray-200">
      <h1 className="text-4xl font-bold mb-8">Selection Sort Visualizer</h1>
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="mb-6">
          <label htmlFor="array" className="text-lg font-medium mr-4">
            Array (comma-separated):
          </label>
          <input
            type="text"
            id="array"
            value={array.join(", ")}
            onChange={handleArrayChange}
            className="p-2 border rounded-md dark:bg-gray-700"
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
        <div className="flex justify-center items-end h-64 bg-gray-200 dark:bg-gray-700 p-4 rounded-md">
          {(visualization ? visualization.array : array).map(
            (value: number, index: number) => (
              <div
                key={index}
                className={`w-8 mx-1 ${getBarColor(index)}`}
                style={{ height: `${value * 20}px` }}
              >
                <span className="text-white text-center w-full block">
                  {value}
                </span>
              </div>
            ),
          )}
        </div>
        {visualization && (
          <div className="font-mono text-lg bg-gray-200 dark:bg-gray-700 p-4 rounded-md mt-6">
            <p>
              i: {visualization.i}, j: {visualization.j}, min_idx:{" "}
              {visualization.min_idx}
            </p>
            <p>Phase: {visualization.phase}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectionSortVisualizer;
