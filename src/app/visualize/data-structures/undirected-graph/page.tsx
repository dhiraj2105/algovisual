"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import { motion, PanInfo, AnimatePresence } from "framer-motion";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

// --- TYPE DEFINITIONS ---
type GraphNode = { id: number; x: number; y: number };
type Edge = { source: number; target: number };
type DS_Element = { uid: string; value: number };
type AlgorithmState = { name: string; dataStructure: DS_Element[] };

// --- VISUAL COMPONENTS ---

const Node = ({
  node,
  highlightColor,
  onDrag,
}: {
  node: GraphNode;
  highlightColor?: string;
  onDrag: (info: PanInfo) => void;
}) => {
  const colorClasses: { [key: string]: string } = {
    blue: "bg-blue-500 text-white border-blue-300",
    green: "bg-green-500 text-white border-green-300",
    red: "bg-red-500 text-white border-red-300",
    purple: "bg-purple-500 text-white border-purple-300",
    yellow: "bg-yellow-400 text-black border-yellow-200",
  };
  const highlightClass = highlightColor
    ? colorClasses[highlightColor]
    : "bg-white dark:bg-gray-700 border-slate-400 dark:border-slate-500";

  return (
    <motion.div
      drag
      onDrag={(_, info) => onDrag(info)}
      dragMomentum={false}
      style={{ left: node.x - 24, top: node.y - 24, position: "absolute" }}
      className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg border-2 z-10 cursor-grab active:cursor-grabbing ${highlightClass}`}
    >
      <span className="text-lg font-bold">{node.id}</span>
    </motion.div>
  );
};

const StatusBox = ({ text }: { text: string }) => (
  <motion.div
    key={text}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="absolute top-4 left-4 bg-gray-800 bg-opacity-80 text-white p-3 rounded-lg shadow-lg z-30 max-w-sm"
  >
    {text}
  </motion.div>
);

const AlgorithmStateVisualizer = ({ state }: { state: AlgorithmState }) => {
  const isQueue = state.name.includes("BFS") || state.name.includes("Path");
  const dsName = isQueue ? "Queue" : "Stack";

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="absolute top-4 right-4 bg-gray-700/80 backdrop-blur-sm text-white p-4 rounded-lg shadow-2xl z-30 w-64"
    >
      <h2 className="text-lg font-bold text-center mb-2 border-b border-gray-500 pb-2">
        {state.name}
      </h2>
      <h3 className="font-semibold mb-2 text-center text-cyan-300">{dsName}</h3>
      <div
        className={`flex gap-2 p-2 rounded-md bg-black/20 min-h-[48px] text-lg ${isQueue ? "flex-row" : "flex-col-reverse"}`}
      >
        <AnimatePresence>
          {state.dataStructure.map((el) => (
            <motion.div
              key={el.uid}
              layout
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="w-10 h-10 bg-sky-500 rounded-md flex items-center justify-center font-bold shadow-inner"
            >
              {el.value}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex justify-between text-xs mt-1 px-1 text-gray-400">
        {isQueue ? (
          <>
            <span>Front</span>
            <span>Back</span>
          </>
        ) : (
          <span>Top</span>
        )}
      </div>
    </motion.div>
  );
};

// --- UI COMPONENTS ---

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
    className={`px-3 py-2 text-sm rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

const TextInput = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="border p-2 text-sm rounded-lg w-24 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
);

const STROKE_COLOR_MAP: { [key: string]: string } = {
  blue: "stroke-blue-500",
  green: "stroke-green-500",
  red: "stroke-red-500",
  purple: "stroke-purple-500",
  yellow: "stroke-yellow-400",
};
const DEFAULT_STROKE_CLASS = "stroke-slate-500 dark:stroke-slate-400";

// --- MAIN VISUALIZER COMPONENT ---

export default function GraphVisualizer() {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [statusText, setStatusText] = useState(
    "Add a node or generate a random graph to start.",
  );
  const [highlights, setHighlights] = useState<{
    nodes: { [key: number]: string };
    edges: { [key: string]: string };
  }>({ nodes: {}, edges: {} });
  const [algorithmState, setAlgorithmState] = useState<AlgorithmState | null>(
    null,
  );
  const visRef = useRef<HTMLDivElement>(null);
  const uidCounter = useRef(0);

  // --- State for Inputs ---
  const [edgeSource, setEdgeSource] = useState("");
  const [edgeTarget, setEdgeTarget] = useState("");
  const [startNode, setStartNode] = useState("");
  const [endNode, setEndNode] = useState("");

  // --- Layout Calculation ---
  const layout = useMemo(() => {
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    const positionedEdges = edges
      .map((edge) => {
        const sourceNode = nodeMap.get(edge.source);
        const targetNode = nodeMap.get(edge.target);
        if (!sourceNode || !targetNode) return null;
        return {
          ...edge,
          x1: sourceNode.x,
          y1: sourceNode.y,
          x2: targetNode.x,
          y2: targetNode.y,
        };
      })
      .filter(Boolean) as (Edge & {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    })[];

    return { nodes, edges: positionedEdges };
  }, [nodes, edges]);

  const getEdgeKey = useCallback(
    (n1: number, n2: number) => [n1, n2].sort((a, b) => a - b).join("-"),
    [],
  );

  // --- GRAPH OPERATIONS ---
  const addNode = () => {
    if (isAnimating) return;
    const visRect = visRef.current?.getBoundingClientRect();
    const centerX = visRect ? visRect.width / 2 : 400;
    const centerY = visRect ? visRect.height / 2 : 300;

    const newNodeId =
      (nodes.length > 0 ? Math.max(...nodes.map((n) => n.id)) : 0) + 1;
    setNodes([...nodes, { id: newNodeId, x: centerX, y: centerY }]);
    setStatusText(`Added Node ${newNodeId}. Drag it to position.`);
  };

  const addEdge = () => {
    if (isAnimating || !edgeSource || !edgeTarget) return;
    const source = parseInt(edgeSource),
      target = parseInt(edgeTarget);
    if (isNaN(source) || isNaN(target) || source === target) return;
    if (
      !nodes.find((n) => n.id === source) ||
      !nodes.find((n) => n.id === target)
    ) {
      setStatusText("Error: One or both nodes do not exist.");
      return;
    }
    if (
      edges.some(
        (e) =>
          (e.source === source && e.target === target) ||
          (e.source === target && e.target === source),
      )
    ) {
      setStatusText("Error: Edge already exists.");
      return;
    }
    setEdges([...edges, { source, target }]);
    setStatusText(`Added Edge ${source}-${target}.`);
    setEdgeSource("");
    setEdgeTarget("");
  };

  const generateRandomGraph = () => {
    if (isAnimating) return;
    setStatusText("Generating random graph...");
    const numNodes = 8;
    const edgeProbability = 0.4;
    const visRect = visRef.current?.getBoundingClientRect();
    const centerX = visRect ? visRect.width / 2 : 400;
    const centerY = visRect ? visRect.height / 2 : 300;
    const radius = Math.min(centerX, centerY) - 50;
    const newNodes = Array.from({ length: numNodes }, (_, i) => {
      const angle = (i / numNodes) * 2 * Math.PI;
      return {
        id: i + 1,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
    const newEdges: Edge[] = [];
    for (let i = 1; i <= numNodes; i++) {
      for (let j = i + 1; j <= numNodes; j++) {
        if (Math.random() < edgeProbability) {
          newEdges.push({ source: i, target: j });
        }
      }
    }
    setNodes(newNodes);
    setEdges(newEdges);
    setStatusText("Random graph generated. Drag nodes to rearrange.");
  };

  const updateNodePosition = (nodeId: number, info: PanInfo) => {
    setNodes((currentNodes) =>
      currentNodes.map((n) =>
        n.id === nodeId
          ? { ...n, x: n.x + info.delta.x, y: n.y + info.delta.y }
          : n,
      ),
    );
  };

  // --- ALGORITHMS ---
  const runAlgorithm = async (
    algo: (startId: number) => Promise<void>,
    name: string,
  ) => {
    if (isAnimating || !startNode) return;
    const startId = parseInt(startNode);
    if (isNaN(startId) || !nodes.find((n) => n.id === startId)) {
      setStatusText("Invalid or non-existent start node.");
      return;
    }
    setIsAnimating(true);
    uidCounter.current = 0;
    setHighlights({ nodes: {}, edges: {} });
    setAlgorithmState({ name, dataStructure: [] });
    await algo(startId);
    setIsAnimating(false);
    setStatusText("Algorithm finished. Ready.");
    await sleep(2000);
    setHighlights({ nodes: {}, edges: {} });
    setAlgorithmState(null);
  };

  const bfs = async (startId: number) => {
    const q: DS_Element[] = [
      { uid: `ds-${uidCounter.current++}`, value: startId },
    ];
    setAlgorithmState({ name: "BFS", dataStructure: [...q] });
    setStatusText(`Starting BFS. Enqueue ${startId}.`);
    const visited = new Set<number>([startId]);
    setHighlights((h) => ({
      ...h,
      nodes: { ...h.nodes, [startId]: "yellow" },
    }));
    await sleep(800);

    while (q.length > 0) {
      const u_obj = q.shift()!;
      const u = u_obj.value;
      setAlgorithmState((s) => (s ? { ...s, dataStructure: [...q] } : null));
      setStatusText(`Dequeue ${u}. Visiting node ${u}.`);
      setHighlights((h) => ({ ...h, nodes: { ...h.nodes, [u]: "blue" } }));
      await sleep(800);

      const neighbors = edges
        .filter((e) => e.source === u || e.target === u)
        .map((e) => (e.source === u ? e.target : e.source));
      for (const v of neighbors) {
        if (!visited.has(v)) {
          visited.add(v);
          q.push({ uid: `ds-${uidCounter.current++}`, value: v });
          const edgeKey = getEdgeKey(u, v);
          setAlgorithmState((s) =>
            s ? { ...s, dataStructure: [...q] } : null,
          );
          setStatusText(`Enqueue ${v}.`);
          setHighlights((h) => ({
            nodes: { ...h.nodes, [v]: "yellow" },
            edges: { ...h.edges, [edgeKey]: "blue" },
          }));
          await sleep(800);
        }
      }
      setHighlights((h) => ({ ...h, nodes: { ...h.nodes, [u]: "purple" } }));
    }
  };

  const dfs = async (startId: number) => {
    const stack: DS_Element[] = [
      { uid: `ds-${uidCounter.current++}`, value: startId },
    ];
    setAlgorithmState({ name: "DFS", dataStructure: [...stack] });
    setStatusText(`Starting DFS. Push ${startId}.`);
    const visited = new Set<number>();
    await sleep(800);

    while (stack.length > 0) {
      const u_obj = stack.pop()!;
      const u = u_obj.value;
      setAlgorithmState((s) =>
        s ? { ...s, dataStructure: [...stack] } : null,
      );
      if (visited.has(u)) continue;

      visited.add(u);
      setStatusText(`Pop ${u}. Visiting node ${u}.`);
      setHighlights((h) => ({ ...h, nodes: { ...h.nodes, [u]: "blue" } }));
      await sleep(800);

      const neighbors = edges
        .filter((e) => e.source === u || e.target === u)
        .map((e) => (e.source === u ? e.target : e.source));
      for (const v of neighbors) {
        if (!visited.has(v)) {
          const edgeKey = getEdgeKey(u, v);
          stack.push({ uid: `ds-${uidCounter.current++}`, value: v });
          setAlgorithmState((s) =>
            s ? { ...s, dataStructure: [...stack] } : null,
          );
          setStatusText(`Push ${v}.`);
          setHighlights((h) => ({
            ...h,
            edges: { ...h.edges, [edgeKey]: "blue" },
          }));
          await sleep(800);
        }
      }
      setHighlights((h) => ({ ...h, nodes: { ...h.nodes, [u]: "purple" } }));
    }
  };

  const shortestPath = async (startId: number) => {
    const endId = parseInt(endNode);
    if (isNaN(endId) || !nodes.find((n) => n.id === endId)) {
      setStatusText("Invalid or non-existent end node.");
      return;
    }

    const q: DS_Element[] = [
      { uid: `ds-${uidCounter.current++}`, value: startId },
    ];
    setAlgorithmState({ name: "Shortest Path (BFS)", dataStructure: [...q] });
    setStatusText(
      `Finding path from ${startId} to ${endId}. Enqueue ${startId}.`,
    );
    const visited = new Set<number>([startId]);
    const parent: { [key: number]: number | null } = { [startId]: null };
    let pathFound = false;

    while (q.length > 0) {
      const u_obj = q.shift()!;
      const u = u_obj.value;
      setAlgorithmState((s) => (s ? { ...s, dataStructure: [...q] } : null));
      setHighlights((h) => ({ ...h, nodes: { ...h.nodes, [u]: "blue" } }));
      if (u === endId) {
        pathFound = true;
        break;
      }
      await sleep(500);

      const neighbors = edges
        .filter((e) => e.source === u || e.target === u)
        .map((e) => (e.source === u ? e.target : e.source));
      for (const v of neighbors) {
        if (!visited.has(v)) {
          visited.add(v);
          parent[v] = u;
          q.push({ uid: `ds-${uidCounter.current++}`, value: v });
          const edgeKey = getEdgeKey(u, v);
          setAlgorithmState((s) =>
            s ? { ...s, dataStructure: [...q] } : null,
          );
          setHighlights((h) => ({
            ...h,
            nodes: { ...h.nodes, [v]: "yellow" },
            edges: { ...h.edges, [edgeKey]: "blue" },
          }));
          await sleep(500);
        }
      }
    }

    if (pathFound) {
      setStatusText("Path found! Highlighting...");
      const pathHighlights: {
        nodes: { [key: number]: string };
        edges: { [key: string]: string };
      } = { nodes: {}, edges: {} };
      let curr: number | null = endId;
      while (curr != null) {
        pathHighlights.nodes[curr] = "green";
        const p: number | null | undefined = parent[curr];
        if (p != null) {
          pathHighlights.edges[getEdgeKey(curr, p)] = "green";
        }
        curr = p ?? null;
      }
      setHighlights(pathHighlights);
    } else {
      setStatusText(`No path found from ${startId} to ${endId}.`);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="p-4 shadow-md bg-white dark:bg-gray-800 z-20">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
          Undirected Graph Visualizer
        </h1>
      </header>

      <div
        ref={visRef}
        className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <StatusBox text={statusText} />
        <AnimatePresence>
          {algorithmState && (
            <AlgorithmStateVisualizer state={algorithmState} />
          )}
        </AnimatePresence>
        <svg className="absolute inset-0 w-full h-full">
          {layout.edges.map((edge) => {
            const edgeKey = getEdgeKey(edge.source, edge.target);
            const highlightColor = highlights.edges[edgeKey];
            const strokeClass = highlightColor
              ? STROKE_COLOR_MAP[highlightColor]
              : DEFAULT_STROKE_CLASS;

            return (
              <motion.line
                key={edgeKey}
                layout
                x1={edge.x1}
                y1={edge.y1}
                x2={edge.x2}
                y2={edge.y2}
                className={strokeClass}
                strokeWidth={highlightColor ? 4 : 2}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            );
          })}
        </svg>
        {layout.nodes.map((node) => (
          <Node
            key={node.id}
            node={node}
            highlightColor={highlights.nodes[node.id]}
            onDrag={(info) => updateNodePosition(node.id, info)}
          />
        ))}
      </div>

      <footer className="p-3 bg-white dark:bg-gray-800 rounded-t-2xl shadow-inner z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          <div className="flex flex-col gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <h3 className="font-bold">Graph</h3>
            <div className="flex gap-2">
              <ActionButton onClick={addNode} className="bg-green-600 w-full">
                Add Node
              </ActionButton>
              <ActionButton
                onClick={generateRandomGraph}
                className="bg-indigo-600 w-full"
              >
                Random
              </ActionButton>
            </div>
            <div className="flex items-center gap-2">
              <TextInput
                value={edgeSource}
                onChange={(e) => setEdgeSource(e.target.value)}
                placeholder="Src"
              />
              <TextInput
                value={edgeTarget}
                onChange={(e) => setEdgeTarget(e.target.value)}
                placeholder="Tgt"
              />
              <ActionButton onClick={addEdge} className="bg-green-700 flex-1">
                Add Edge
              </ActionButton>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <h3 className="font-bold">Traversals</h3>
            <div className="flex items-center gap-2">
              <TextInput
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
                placeholder="Start"
              />
              <ActionButton
                onClick={() => runAlgorithm(bfs, "BFS")}
                className="bg-sky-600 flex-1"
              >
                BFS
              </ActionButton>
              <ActionButton
                onClick={() => runAlgorithm(dfs, "DFS")}
                className="bg-sky-700 flex-1"
              >
                DFS
              </ActionButton>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <h3 className="font-bold">Shortest Path</h3>
            <div className="flex items-center gap-2">
              <TextInput
                value={startNode}
                onChange={(e) => setStartNode(e.target.value)}
                placeholder="Start"
              />
              <TextInput
                value={endNode}
                onChange={(e) => setEndNode(e.target.value)}
                placeholder="End"
              />
              <ActionButton
                onClick={() => runAlgorithm(shortestPath, "Shortest Path")}
                className="bg-orange-600 flex-1"
              >
                Find Path
              </ActionButton>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
