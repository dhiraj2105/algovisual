"use client";
import { useState, useEffect, useRef } from "react";

const patterns = [
  {
    name: "Right Triangle",
    description: "A simple right-angled triangle pattern.",
    code: (limit: number) =>
      `for (let i = 1; i <= ${limit}; i++)\n  for (let j = 1; j <= i; j++) {\n    // print \"* \"\n  }\n  // new line\n}`,
    generator: function* (limit: number) {
      let output = "";
      for (let i = 1; i <= limit; i++) {
        yield { i, j: null, output, highlight: "outer" };
        for (let j = 1; j <= i; j++) {
          yield { i, j, output, highlight: "inner" };
          output += "* ";
        }
        output += "\n";
      }
      yield { i: limit, j: limit, output, highlight: "done" };
    },
  },
  {
    name: "Square",
    description: "A simple square pattern.",
    code: (limit: number) =>
      `for (let i = 1; i <= ${limit}; i++) {\n  for (let j = 1; j <= ${limit}; j++) {\n    // print \"* \"\n  }\n  // new line\n}`,
    generator: function* (limit: number) {
      let output = "";
      for (let i = 1; i <= limit; i++) {
        yield { i, j: null, output, highlight: "outer" };
        for (let j = 1; j <= limit; j++) {
          yield { i, j, output, highlight: "inner" };
          output += "* ";
        }
        output += "\n";
      }
      yield { i: limit, j: limit, output, highlight: "done" };
    },
  },
  {
    name: "Inverted Right Triangle",
    description: "An inverted right-angled triangle pattern.",
    code: (limit: number) =>
      `for (let i = 1; i <= ${limit}; i++) {\n  for (let j = i; j <= ${limit}; j++) {\n    // print \"* \"\n  }\n  // new line\n}`,
    generator: function* (limit: number) {
      let output = "";
      for (let i = 1; i <= limit; i++) {
        yield { i, j: null, output, highlight: "outer" };
        for (let j = i; j <= limit; j++) {
          yield { i, j, output, highlight: "inner" };
          output += "* ";
        }
        output += "\n";
      }
      yield { i: limit, j: limit, output, highlight: "done" };
    },
  },
  {
    name: "Number Triangle",
    description: "A triangle pattern with numbers.",
    code: (limit: number) =>
      `for (let i = 1; i <= ${limit}; i++) {\n  for (let j = 1; j <= i; j++) {\n    // print j + \" \"\n  }\n  // new line\n}`,
    generator: function* (limit: number) {
      let output = "";
      for (let i = 1; i <= limit; i++) {
        yield { i, j: null, output, highlight: "outer" };
        for (let j = 1; j <= i; j++) {
          yield { i, j, output, highlight: "inner" };
          output += j + " ";
        }
        output += "\n";
      }
      yield { i: limit, j: limit, output, highlight: "done" };
    },
  },
];

const StarPatternVisualizer = () => {
  const [selectedPattern, setSelectedPattern] = useState(patterns[0]);
  const [limit, setLimit] = useState(5);
  const [visualization, setVisualization] = useState<{
    i: number | null;
    j: number | null;
    output: string;
    highlight: string;
  } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [generator, setGenerator] = useState<Generator | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handlePatternChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pattern = patterns.find((p) => p.name === e.target.value);
    if (pattern) {
      setSelectedPattern(pattern);
      resetVisualization();
    }
  };

  const startVisualization = () => {
    setIsRunning(true);
    const gen = selectedPattern.generator(limit);
    setGenerator(gen);
  };

  const pauseVisualization = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetVisualization = () => {
    setIsRunning(false);
    setVisualization(null);
    setGenerator(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    if (isRunning && generator) {
      intervalRef.current = setInterval(() => {
        const next = generator.next();
        if (next.done) {
          setIsRunning(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
        setVisualization(next.value);
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

  const getHighlightClass = (part: "outer" | "inner" | "done") => {
    if (!visualization) return "";
    if (visualization.highlight === part) {
      switch (part) {
        case "outer":
          return "text-blue-500 dark:text-blue-400";
        case "inner":
          return "text-green-500 dark:text-green-400";
        default:
          return "";
      }
    }
    return "";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 text-gray-800 dark:text-gray-200">
      <h1 className="text-4xl font-bold mb-8">Star Pattern Visualizer</h1>

      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="pattern" className="text-lg font-medium mr-4">
              Select Pattern:
            </label>
            <select
              id="pattern"
              onChange={handlePatternChange}
              value={selectedPattern.name}
              className="p-2 border rounded-md bg-white dark:bg-gray-700"
            >
              {patterns.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="limit" className="text-lg font-medium mr-4">
              Size:
            </label>
            <input
              type="number"
              id="limit"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value, 10))}
              className="w-24 p-2 border rounded-md dark:bg-gray-700"
              max={20}
            />
          </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Code</h2>
            <pre
              className={`font-mono text-lg bg-gray-200 dark:bg-gray-700 p-4 rounded-md whitespace-pre-wrap`}
            >
              <span className={getHighlightClass("outer")}>
                {selectedPattern.code(limit).split("\n")[0]}
              </span>
              <span
                className={getHighlightClass("inner")}
              >{`\n${selectedPattern.code(limit).split("\n")[1]}`}</span>
              {`\n${selectedPattern.code(limit).split("\n").slice(2).join("\n")}`}
            </pre>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Visualization</h2>
            <div className="font-mono text-lg bg-gray-200 dark:bg-gray-700 p-4 rounded-md h-64 overflow-auto whitespace-pre">
              {visualization?.output}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Variables</h2>
            <div className="font-mono text-lg bg-gray-200 dark:bg-gray-700 p-4 rounded-md">
              <p>
                i:{" "}
                <span className="text-blue-500 dark:text-blue-400">
                  {visualization?.i}
                </span>
              </p>
              <p>
                j:{" "}
                <span className="text-green-500 dark:text-green-400">
                  {visualization?.j}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StarPatternVisualizer;
