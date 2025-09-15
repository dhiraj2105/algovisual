"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

type BSTNode = {
  id: number;
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
  x?: number;
  y?: number;
};

const Node = ({
  node,
  highlightColor,
}: {
  node: BSTNode;
  highlightColor?: string;
}) => {
  const colorClasses: { [key: string]: string } = {
    blue: "bg-blue-500 text-white border-blue-300",
    green: "bg-green-500 text-white border-green-300",
    red: "bg-red-500 text-white border-red-300",
    purple: "bg-purple-500 text-white border-purple-300",
  };
  const highlightClass = highlightColor
    ? colorClasses[highlightColor]
    : "bg-white dark:bg-gray-700 border-slate-400 dark:border-slate-500";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: highlightColor ? 1.1 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ left: node.x, top: node.y, position: "absolute" }}
      className={`flex flex-col items-center justify-center w-16 h-16 rounded-full shadow-lg border-2 z-10 ${highlightClass}`}
    >
      <div className="text-lg font-bold">{node.value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        id:{node.id}
      </div>
    </motion.div>
  );
};

const GhostNode = ({
  node,
}: {
  node: { value: number; x: number; y: number };
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.7 }}
    animate={{ opacity: 1, scale: 1 }}
    style={{ left: node.x, top: node.y, position: "absolute" }}
    className="flex items-center justify-center w-16 h-16 rounded-md bg-green-200 dark:bg-green-700 text-black dark:text-white shadow-lg z-20"
  >
    <div className="text-lg font-bold">{node.value}</div>
  </motion.div>
);

const StatusBox = ({ text }: { text: string }) => (
  <motion.div
    key={text} // Re-triggers animation on text change
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="absolute top-4 left-4 bg-gray-800 bg-opacity-80 text-white p-3 rounded-lg shadow-lg z-30"
  >
    {text}
  </motion.div>
);

const ActionButton = ({
  onClick,
  children,
  className,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  className: string;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

const NumberInput = ({
  value,
  onChange,
  placeholder,
  onKeyDown,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  onKeyDown: (e: React.KeyboardEvent) => void;
}) => (
  <input
    type="number"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    onKeyDown={onKeyDown}
    className="border p-2 rounded-lg w-32 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
  />
);

export default function BSTVisualizer() {
  const [root, setRoot] = useState<BSTNode | null>(null);
  const [idCounter, setIdCounter] = useState(1);
  const [inputValue, setInputValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [deleteValue, setDeleteValue] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [statusText, setStatusText] = useState<string>(
    "Enter a value to start.",
  );
  const [specialHighlights, setSpecialHighlights] = useState<{
    [key: number]: string;
  }>({});
  const [ghostNode, setGhostNode] = useState<{
    value: number;
    x: number;
    y: number;
  } | null>(null);
  const visRef = useRef<HTMLDivElement>(null);
  const [visWidth, setVisWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (visRef.current) {
        setVisWidth(visRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOperation = async (
    operation: (value: number) => Promise<void>,
    valueStr: string,
    operationName: string,
  ) => {
    if (!valueStr || isAnimating) return;
    const value = Number(valueStr);
    setIsAnimating(true);
    setStatusText(`Starting ${operationName} operation for value ${value}.`);
    await operation(value);
    setIsAnimating(false);
    setSpecialHighlights({});
    setGhostNode(null);
    setStatusText("Ready.");
  };

  const insertNode = async (value: number) => {
    const newNode: BSTNode = { id: idCounter, value, left: null, right: null };
    setIdCounter((c) => c + 1);
    setGhostNode({ value, x: visWidth / 2, y: 0 });
    await sleep(400);

    const insertRec = async (node: BSTNode | null): Promise<BSTNode> => {
      if (!node) {
        setStatusText(
          root
            ? `Found insertion point. Inserting ${value}.`
            : `Tree is empty. Inserting ${value} as root.`,
        );
        await sleep(800);
        setSpecialHighlights({ [newNode.id]: "green" });
        setGhostNode(null);
        await sleep(800);
        return newNode;
      }

      setGhostNode((g) =>
        g ? { ...g, x: node.x! + 4, y: node.y! - 80 } : null,
      );
      await sleep(500);
      setSpecialHighlights({ [node.id]: "blue" });
      setStatusText(`Comparing ${value} with ${node.value}.`);
      await sleep(800);

      if (value < node.value) {
        setStatusText(`${value} < ${node.value}. Going left.`);
        await sleep(800);
        setSpecialHighlights({});
        node.left = await insertRec(node.left);
      } else {
        setStatusText(`${value} >= ${node.value}. Going right.`);
        await sleep(800);
        setSpecialHighlights({});
        node.right = await insertRec(node.right);
      }
      return node;
    };

    const updatedRoot = await insertRec(root);
    setRoot({ ...updatedRoot });
    setInputValue("");
  };

  const searchNode = async (value: number) => {
    setGhostNode({ value, x: visWidth / 2, y: 0 });
    await sleep(400);

    const searchRec = async (node: BSTNode | null) => {
      if (!node) {
        setStatusText(`Value ${value} not found.`);
        setGhostNode(null);
        return;
      }

      setGhostNode((g) =>
        g ? { ...g, x: node.x! + 4, y: node.y! - 80 } : null,
      );
      await sleep(500);
      setSpecialHighlights({ [node.id]: "blue" });
      setStatusText(`Comparing ${value} with ${node.value}.`);
      await sleep(800);

      if (node.value === value) {
        setStatusText(`Value ${value} found!`);
        setSpecialHighlights({ [node.id]: "green" });
        await sleep(1500);
        return;
      }
      if (value < node.value) {
        setStatusText(`${value} < ${node.value}. Going left.`);
        await sleep(800);
        await searchRec(node.left);
      } else {
        setStatusText(`${value} > ${node.value}. Going right.`);
        await sleep(800);
        await searchRec(node.right);
      }
    };
    await searchRec(root);
    setSearchValue("");
  };

  const deleteNode = async (value: number) => {
    const deleteRec = async (
      node: BSTNode | null,
      val: number,
    ): Promise<BSTNode | null> => {
      if (!node) {
        setStatusText(`Value ${value} not found to delete.`);
        return null;
      }

      setSpecialHighlights({ [node.id]: "blue" });
      setStatusText(`Comparing ${value} with ${node.value}.`);
      await sleep(800);

      if (val < node.value) {
        setStatusText(`${value} < ${node.value}. Going left.`);
        await sleep(800);
        node.left = await deleteRec(node.left, val);
      } else if (val > node.value) {
        setStatusText(`${value} > ${node.value}. Going right.`);
        await sleep(800);
        node.right = await deleteRec(node.right, val);
      } else {
        setStatusText(`Found node with value ${value}.`);
        setSpecialHighlights({ [node.id]: "red" });
        await sleep(800);

        if (!node.left) return node.right;
        if (!node.right) return node.left;

        setStatusText(`Node has two children. Finding successor...`);
        await sleep(800);
        let successor = node.right;
        while (successor.left) {
          setSpecialHighlights((h) => ({ ...h, [successor.id]: "purple" }));
          await sleep(400);
          successor = successor.left;
        }

        setStatusText(
          `Successor is ${successor.value}. Replacing ${node.value}.`,
        );
        setSpecialHighlights((h) => ({
          ...h,
          [node.id]: "red",
          [successor.id]: "green",
        }));
        await sleep(1200);
        node.value = successor.value;
        setRoot({ ...root! });
        await sleep(500);
        setStatusText(`Removing original successor node.`);
        await sleep(800);
        node.right = await deleteRec(node.right, successor.value);
      }
      return node;
    };

    const updatedRoot = await deleteRec(root, value);
    setRoot(updatedRoot ? { ...updatedRoot } : null);
    setDeleteValue("");
  };

  const destroyTree = () => {
    if (isAnimating) return;
    setRoot(null);
    setStatusText("Tree destroyed. Enter a value to start.");
  };

  const renderData = useMemo(() => {
    if (!root || visWidth === 0) return { allNodes: [], lines: [] };
    const xPositions = new Map<number, number>();
    let count = 0;
    const getXPositions = (n: BSTNode | null) => {
      if (!n) return;
      getXPositions(n.left);
      xPositions.set(n.id, count++);
      getXPositions(n.right);
    };
    getXPositions(root);

    const allNodes: BSTNode[] = [];
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const nodeWidth = 64;
    const horizontalSpacing =
      count > 1 ? (visWidth - nodeWidth - 40) / (count - 1) : 0;
    const verticalGap = 100;
    const nodeRadius = 32;

    const q: [BSTNode, number][] = [[root, 0]];
    const visited = new Set<number>();

    while (q.length > 0) {
      const [parent, level] = q.shift()!;
      if (visited.has(parent.id)) continue;
      visited.add(parent.id);

      parent.x = xPositions.get(parent.id)! * horizontalSpacing + 20;
      parent.y = level * verticalGap + 40;
      allNodes.push(parent);

      const children = [parent.left, parent.right].filter(Boolean) as BSTNode[];
      for (const child of children) {
        const childLevel = level + 1;
        child.x = xPositions.get(child.id)! * horizontalSpacing + 20;
        child.y = childLevel * verticalGap + 40;

        const dx = child.x - parent.x;
        const dy = child.y - parent.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ratio = nodeRadius / dist;

        lines.push({
          x1: parent.x + nodeRadius + dx * ratio,
          y1: parent.y + nodeRadius + dy * ratio,
          x2: child.x + nodeRadius - dx * ratio,
          y2: child.y + nodeRadius - dy * ratio,
        });
        q.push([child, childLevel]);
      }
    }
    return { allNodes, lines };
  }, [root, visWidth]);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="p-4 shadow-md bg-white dark:bg-gray-800 z-20">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
          Binary Search Tree Visualizer
        </h1>
      </header>

      <div ref={visRef} className="flex-1 p-4 relative overflow-auto z-0">
        <StatusBox text={statusText} />
        {ghostNode && <GhostNode node={ghostNode} />}
        <svg className="absolute top-0 left-0 w-full h-full">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="5"
              markerHeight="3.5"
              refX="4"
              refY="1.75"
              orient="auto"
            >
              <polygon points="0 0, 4 1.75, 0 3.5" className="fill-current" />
            </marker>
          </defs>
          {renderData.lines.map((line, idx) => (
            <motion.line
              key={idx}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              className="stroke-slate-600 dark:stroke-slate-400 text-slate-600 dark:text-slate-400"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          ))}
        </svg>
        {renderData.allNodes.map((node) => (
          <Node
            key={node.id}
            node={node}
            highlightColor={specialHighlights[node.id]}
          />
        ))}
      </div>

      <footer className="p-4 bg-white dark:bg-gray-800 rounded-t-2xl shadow-inner z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <NumberInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Value"
              onKeyDown={(e) =>
                e.key === "Enter" &&
                handleOperation(insertNode, inputValue, "Insert")
              }
            />
            <ActionButton
              onClick={() => handleOperation(insertNode, inputValue, "Insert")}
              className="bg-green-600 hover:bg-green-700"
              disabled={isAnimating}
            >
              Insert
            </ActionButton>
          </div>
          <div className="flex items-center gap-2">
            <NumberInput
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Value"
              onKeyDown={(e) =>
                e.key === "Enter" &&
                handleOperation(searchNode, searchValue, "Search")
              }
            />
            <ActionButton
              onClick={() => handleOperation(searchNode, searchValue, "Search")}
              className="bg-sky-600 hover:bg-sky-700"
              disabled={isAnimating}
            >
              Search
            </ActionButton>
          </div>
          <div className="flex items-center gap-2">
            <NumberInput
              value={deleteValue}
              onChange={(e) => setDeleteValue(e.target.value)}
              placeholder="Value"
              onKeyDown={(e) =>
                e.key === "Enter" &&
                handleOperation(deleteNode, deleteValue, "Delete")
              }
            />
            <ActionButton
              onClick={() => handleOperation(deleteNode, deleteValue, "Delete")}
              className="bg-orange-600 hover:bg-orange-700"
              disabled={isAnimating}
            >
              Delete
            </ActionButton>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <ActionButton
              onClick={destroyTree}
              className="bg-red-600 hover:bg-red-700"
              disabled={isAnimating}
            >
              Destroy Tree
            </ActionButton>
          </div>
        </div>
      </footer>
    </div>
  );
}
