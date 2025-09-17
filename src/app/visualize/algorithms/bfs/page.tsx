"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

type Node = {
  id: string;
  x: number;
  y: number;
};

type Edge = {
  from: string;
  to: string;
};

export default function InteractiveBFSVisualizer() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [visited, setVisited] = useState<string[]>([]);
  const [queue, setQueue] = useState<string[]>([]);
  const [currentNode, setCurrentNode] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [stepExplanation, setStepExplanation] = useState("");
  const [edgeMode, setEdgeMode] = useState<{ from: string | null }>({
    from: null,
  });

  // Add Node at random position (or user click can be implemented)
  const addNode = () => {
    const id = String.fromCharCode(65 + nodes.length);
    const newNode: Node = {
      id,
      x: Math.floor(Math.random() * 300) + 50,
      y: Math.floor(Math.random() * 400) + 50,
    };
    setNodes([...nodes, newNode]);
  };

  // Start drawing edge from a node
  const startEdge = (fromId: string) => {
    if (edgeMode.from === fromId) {
      setEdgeMode({ from: null });
      return;
    }
    setEdgeMode({ from: fromId });
  };

  // Complete edge
  const completeEdge = (toId: string) => {
    if (edgeMode.from && edgeMode.from !== toId) {
      setEdges([...edges, { from: edgeMode.from, to: toId }]);
      setEdgeMode({ from: null });
    }
  };

  // Auto-generate connected graph
  const autoGenerateGraph = () => {
    setNodes([]);
    setEdges([]);
    const n = 6 + Math.floor(Math.random() * 5); // 6-10 nodes
    const newNodes: Node[] = [];
    for (let i = 0; i < n; i++) {
      newNodes.push({
        id: String.fromCharCode(65 + i),
        x: 100 + (i % 3) * 150,
        y: 50 + Math.floor(i / 3) * 150,
      });
    }
    const newEdges: Edge[] = [];
    // Simple connected edges
    for (let i = 1; i < n; i++) {
      const from = newNodes[Math.floor(Math.random() * i)].id;
      const to = newNodes[i].id;
      newEdges.push({ from, to });
    }
    setNodes(newNodes);
    setEdges(newEdges);
  };

  const reset = () => {
    setVisited([]);
    setQueue([]);
    setCurrentNode(null);
    setStepExplanation("");
  };

  // BFS traversal
  const bfs = async (start: string) => {
    if (!nodes.find((n) => n.id === start)) return;
    setIsRunning(true);
    const q: string[] = [start];
    const vis: string[] = [];
    setQueue([...q]);

    while (q.length > 0) {
      const node = q.shift()!;
      setCurrentNode(node);
      setStepExplanation(`🔎 Exploring neighbors of ${node}`);
      if (!vis.includes(node)) {
        vis.push(node);
        setVisited([...vis]);
      }
      setQueue([...q]);
      await sleep(800);

      const neighbors = edges
        .filter((e) => e.from === node)
        .map((e) => e.to)
        .filter((n) => !vis.includes(n) && !q.includes(n));

      for (const nbr of neighbors) {
        q.push(nbr);
        setQueue([...q]);
        await sleep(400);
      }
    }

    setCurrentNode(null);
    setStepExplanation("✅ BFS traversal completed");
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Visualization */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        {stepExplanation && (
          <motion.div
            key={stepExplanation}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-md font-mono bg-blue-100 dark:bg-blue-800 px-4 py-2 rounded-lg shadow"
          >
            {stepExplanation}
          </motion.div>
        )}

        {/* Edges */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {edges.map((edge, i) => {
            const fromNode = nodes.find((n) => n.id === edge.from)!;
            const toNode = nodes.find((n) => n.id === edge.to)!;
            return (
              <line
                key={i}
                x1={fromNode.x + 25}
                y1={fromNode.y + 25}
                x2={toNode.x + 25}
                y2={toNode.y + 25}
                stroke="gray"
                strokeWidth="2"
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => {
          const isVisited = visited.includes(node.id);
          const isCurrent = currentNode === node.id;
          const isEdgeSelected = edgeMode.from === node.id;

          return (
            <motion.div
              key={node.id}
              className="absolute flex items-center justify-center w-12 h-12 rounded-full border shadow-md text-lg text-black font-bold cursor-pointer select-none"
              style={{ left: node.x, top: node.y }}
              animate={{
                backgroundColor: isCurrent
                  ? "#f472b6"
                  : isVisited
                    ? "#4ade80"
                    : isEdgeSelected
                      ? "#60a5fa"
                      : "#ffffff",
                scale: isCurrent ? 1.2 : 1,
              }}
              onClick={() =>
                edgeMode.from ? completeEdge(node.id) : startEdge(node.id)
              }
            >
              {node.id}
            </motion.div>
          );
        })}
      </div>

      {/* Queue Display */}
      <div className="flex gap-2 justify-center mb-2">
        <AnimatePresence>
          {queue.map((qItem, idx) => (
            <motion.div
              key={qItem + idx}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="px-3 py-1 bg-green-200 dark:bg-green-700 rounded shadow text-lg font-semibold"
            >
              {qItem}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="h-1/5 p-4 bg-white dark:bg-gray-800 rounded-t-2xl shadow flex flex-col gap-3">
        <div className="flex gap-2 items-center flex-wrap">
          <button
            onClick={addNode}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Add Node
          </button>
          <button
            onClick={() => setEdgeMode({ from: null })}
            disabled={isRunning}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Add Edge
          </button>
          <button
            onClick={autoGenerateGraph}
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Auto-Generate Graph
          </button>
          <button
            onClick={() => bfs(nodes[0]?.id || "")}
            disabled={isRunning || nodes.length === 0}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded"
          >
            Start BFS
          </button>
          <button
            onClick={reset}
            disabled={isRunning}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>
        <div className="text-xs text-gray-500">
          Click nodes to add edges. BFS starts from first node or user-selected.
        </div>
      </div>
    </div>
  );
}
