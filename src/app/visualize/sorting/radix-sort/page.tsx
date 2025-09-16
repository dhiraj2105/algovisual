"use client";
import { useState, useEffect, useRef } from "react";

interface RadixSortStep {
  array: number[];
  exp: number;
  buckets: number[][];
  phase: string;
}

const RadixSortVisualizer = () => {
  const [array, setArray] = useState([170, 45, 75, 90, 802, 24, 2, 66]);
  const [visualization, setVisualization] = useState<RadixSortStep | null>(
    null,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [generator, setGenerator] = useState<Generator<RadixSortStep> | null>(
    null,
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newArray = e.target.value
      .split(",")
      .map((n) => parseInt(n.trim(), 10))
      .filter((n) => !isNaN(n));
    setArray(newArray);
  };

  function* radixSort(arr: number[]): Generator<RadixSortStep> {
    const max = Math.max(...arr);
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      yield* countingSort(arr, exp);
    }
    yield { array: [...arr], exp: 0, buckets: [], phase: "done" };
  }

  function* countingSort(arr: number[], exp: number): Generator<RadixSortStep> {
    const n = arr.length;
    const output = new Array(n).fill(0);
    const count = new Array(10).fill(0);
    const buckets: number[][] = Array.from({ length: 10 }, () => []);

    for (let i = 0; i < n; i++) {
      const index = Math.floor(arr[i] / exp) % 10;
      count[index]++;
      buckets[index].push(arr[i]);
      yield {
        array: [...arr],
        exp,
        buckets: JSON.parse(JSON.stringify(buckets)),
        phase: "bucketing",
      };
    }

    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    let i = n - 1;
    while (i >= 0) {
      const index = Math.floor(arr[i] / exp) % 10;
      output[count[index] - 1] = arr[i];
      count[index]--;
      i--;
    }

    for (let i = 0; i < n; i++) {
      arr[i] = output[i];
      yield { array: [...arr], exp, buckets: [], phase: "sorting" };
    }
  }

  const startVisualization = () => {
    setIsRunning(true);
    const gen = radixSort([...array]);
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 text-gray-800 dark:text-gray-200">
      <h1 className="text-4xl font-bold mb-8">Radix Sort Visualizer</h1>
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
                className="w-8 mx-1 bg-blue-500"
                style={{ height: `${value * 0.5}px` }}
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
            <p>Exponent: {visualization.exp}</p>
            <p>Phase: {visualization.phase}</p>
            <div className="flex flex-wrap">
              {visualization.buckets.map((bucket, i) => (
                <div key={i} className="mr-4">
                  <p>Bucket {i}:</p>
                  <div className="flex flex-col">
                    {bucket.map((num, j) => (
                      <span key={j}>{num}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RadixSortVisualizer;
