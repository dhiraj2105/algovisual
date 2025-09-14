// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

// const Node = ({
//   node,
//   isHighlighted,
// }: {
//   node: { id: number; value: string };
//   isHighlighted: boolean;
// }) => (
//   <motion.div
//     layout
//     initial={{ opacity: 0, scale: 0.8 }}
//     animate={{ opacity: 1, scale: isHighlighted ? 1.1 : 1 }}
//     transition={{ type: "spring", stiffness: 300, damping: 20 }}
//     className={`flex flex-col items-center justify-center w-24 h-16 rounded-lg shadow-md m-1 ${
//       isHighlighted ? "bg-yellow-300" : "bg-white dark:bg-gray-800"
//     }`}
//   >
//     <div className="text-sm sm:text-base font-semibold">{node.value}</div>
//     <div className="text-xs text-gray-500">id:{node.id}</div>
//   </motion.div>
// );

// const Arrow = () => (
//   <svg width={40} height={20} className="mx-1">
//     <defs>
//       <marker
//         id="arrowhead"
//         markerWidth="10"
//         markerHeight="7"
//         refX="10"
//         refY="3.5"
//         orient="auto"
//       >
//         <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
//       </marker>
//     </defs>
//     <line
//       x1={0}
//       y1={10}
//       x2={30}
//       y2={10}
//       stroke="#475569"
//       strokeWidth={2}
//       markerEnd="url(#arrowhead)"
//     />
//   </svg>
// );

// export default function SinglyLinkedListSnake() {
//   const [nodes, setNodes] = useState<{ id: number; value: string }[]>([]);
//   const [idCounter, setIdCounter] = useState(1);
//   const [inputValue, setInputValue] = useState("");
//   const [targetIndex, setTargetIndex] = useState<string>("0");
//   const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
//   const [message, setMessage] = useState<string | null>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [nodesPerRow, setNodesPerRow] = useState(5);

//   // Adjust nodes per row based on container width
//   useEffect(() => {
//     const handleResize = () => {
//       if (containerRef.current) {
//         const containerWidth = containerRef.current.offsetWidth;
//         const nodeWidth = 100; // approx node + margin
//         setNodesPerRow(Math.max(1, Math.floor(containerWidth / nodeWidth)));
//       }
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const clearMessage = (ms = 1400) => setTimeout(() => setMessage(null), ms);

//   // Insert operations
//   const insertAtHead = async (value: string) => {
//     if (!value) return;
//     const newNode = { id: idCounter, value };
//     setIdCounter((c) => c + 1);

//     setHighlightIndex(0);
//     await sleep(300);
//     setNodes((prev) => [newNode, ...prev]);
//     setHighlightIndex(null);
//   };

//   const insertAtTail = async (value: string) => {
//     if (!value) return;
//     const newNode = { id: idCounter, value };
//     setIdCounter((c) => c + 1);

//     for (let i = 0; i < nodes.length; i++) {
//       setHighlightIndex(i);
//       await sleep(300);
//     }
//     setHighlightIndex(null);

//     setNodes((prev) => [...prev, newNode]);
//   };

//   const insertAtIndex = async (value: string, idx: number) => {
//     if (!value) return;
//     if (idx < 0 || idx > nodes.length) {
//       setMessage("Index out of range");
//       clearMessage();
//       return;
//     }
//     for (let i = 0; i < idx; i++) {
//       setHighlightIndex(i);
//       await sleep(300);
//     }
//     setHighlightIndex(null);
//     const newNode = { id: idCounter, value };
//     setIdCounter((c) => c + 1);
//     setNodes((prev) => {
//       const ns = [...prev];
//       ns.splice(idx, 0, newNode);
//       return ns;
//     });
//   };

//   // Delete operations
//   const deleteHead = async () => {
//     if (nodes.length === 0) {
//       setMessage("List is empty");
//       clearMessage();
//       return;
//     }
//     setHighlightIndex(0);
//     await sleep(300);
//     setNodes((prev) => prev.slice(1));
//     setHighlightIndex(null);
//   };

//   const deleteTail = async () => {
//     if (nodes.length === 0) {
//       setMessage("List is empty");
//       clearMessage();
//       return;
//     }
//     for (let i = 0; i < nodes.length; i++) {
//       setHighlightIndex(i);
//       await sleep(300);
//     }
//     setHighlightIndex(null);
//     setNodes((prev) => prev.slice(0, -1));
//   };

//   const deleteAtIndex = async (idx: number) => {
//     if (idx < 0 || idx >= nodes.length) {
//       setMessage("Index out of range");
//       clearMessage();
//       return;
//     }
//     for (let i = 0; i <= idx; i++) {
//       setHighlightIndex(i);
//       await sleep(300);
//     }
//     setHighlightIndex(null);
//     setNodes((prev) => {
//       const ns = [...prev];
//       ns.splice(idx, 1);
//       return ns;
//     });
//   };

//   const destroyList = () => {
//     setNodes([]);
//     setHighlightIndex(null);
//     setMessage(null);
//   };

//   return (
//     <div className="flex flex-col min-h-screen p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 gap-4">
//       <h1 className="text-2xl font-bold text-center">
//         Singly Linked List Visualizer (Snake Layout)
//       </h1>

//       <div
//         ref={containerRef}
//         className="flex flex-col gap-3 bg-white-4 rounded-2xl shadow overflow-auto"
//       >
//         {Array.from(
//           { length: Math.ceil(nodes.length / nodesPerRow) },
//           (_, rowIdx) => (
//             <div key={rowIdx} className="flex items-center flex-wrap">
//               {nodes
//                 .slice(rowIdx * nodesPerRow, (rowIdx + 1) * nodesPerRow)
//                 .map((node, idx) => (
//                   <React.Fragment key={node.id}>
//                     <Node
//                       node={node}
//                       isHighlighted={
//                         highlightIndex === rowIdx * nodesPerRow + idx
//                       }
//                     />
//                     {idx < nodesPerRow - 1 &&
//                       rowIdx * nodesPerRow + idx < nodes.length - 1 && (
//                         <Arrow />
//                       )}
//                   </React.Fragment>
//                 ))}
//             </div>
//           )
//         )}
//       </div>

//       <div className="flex flex-wrap gap-2">
//         <input
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           placeholder="Value"
//           className="border p-2 rounded w-32"
//         />
//         <input
//           type="number"
//           value={targetIndex}
//           onChange={(e) => setTargetIndex(e.target.value)}
//           placeholder="Index"
//           className="border p-2 rounded w-24"
//         />
//         <button
//           onClick={() => insertAtHead(inputValue)}
//           disabled={!inputValue}
//           className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
//         >
//           Insert Head
//         </button>
//         <button
//           onClick={() => insertAtTail(inputValue)}
//           disabled={!inputValue}
//           className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
//         >
//           Insert Tail
//         </button>
//         <button
//           onClick={() => insertAtIndex(inputValue, Number(targetIndex))}
//           disabled={!inputValue}
//           className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
//         >
//           Insert At Index
//         </button>
//         <button
//           onClick={deleteHead}
//           disabled={nodes.length === 0}
//           className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
//         >
//           Delete Head
//         </button>
//         <button
//           onClick={deleteTail}
//           disabled={nodes.length === 0}
//           className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
//         >
//           Delete Tail
//         </button>
//         <button
//           onClick={() => deleteAtIndex(Number(targetIndex))}
//           disabled={nodes.length === 0}
//           className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
//         >
//           Delete At Index
//         </button>
//         <button
//           onClick={destroyList}
//           className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
//         >
//           Destroy List
//         </button>
//       </div>

//       {message && <div className="text-sm text-red-500">{message}</div>}
//     </div>
//   );
// }

"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const Node = ({
  node,
  isHighlighted,
}: {
  node: { id: number; value: string };
  isHighlighted: boolean;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: isHighlighted ? 1.1 : 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={`flex flex-col items-center justify-center w-24 h-16 rounded-lg shadow-md m-1 ${
      isHighlighted ? "bg-yellow-300" : "bg-white dark:bg-gray-800"
    }`}
  >
    <div className="text-sm sm:text-base font-semibold">{node.value}</div>
    <div className="text-xs text-gray-500">id:{node.id}</div>
  </motion.div>
);

const Arrow = () => (
  <svg width={40} height={20} className="mx-1">
    <defs>
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        refX="10"
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
      </marker>
    </defs>
    <line
      x1={0}
      y1={10}
      x2={30}
      y2={10}
      stroke="#475569"
      strokeWidth={2}
      markerEnd="url(#arrowhead)"
    />
  </svg>
);

export default function SinglyLinkedListSnake() {
  const [nodes, setNodes] = useState<{ id: number; value: string }[]>([]);
  const [idCounter, setIdCounter] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [targetIndex, setTargetIndex] = useState<string>("0");
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodesPerRow, setNodesPerRow] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const nodeWidth = 100;
        setNodesPerRow(Math.max(1, Math.floor(containerWidth / nodeWidth)));
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const clearMessage = (ms = 1400) => setTimeout(() => setMessage(null), ms);

  const insertAtHead = async (value: string) => {
    if (!value) return;
    const newNode = { id: idCounter, value };
    setIdCounter((c) => c + 1);
    setHighlightIndex(0);
    await sleep(300);
    setNodes((prev) => [newNode, ...prev]);
    setHighlightIndex(null);
  };

  const insertAtTail = async (value: string) => {
    if (!value) return;
    const newNode = { id: idCounter, value };
    setIdCounter((c) => c + 1);
    for (let i = 0; i < nodes.length; i++) {
      setHighlightIndex(i);
      await sleep(300);
    }
    setHighlightIndex(null);
    setNodes((prev) => [...prev, newNode]);
  };

  const insertAtIndex = async (value: string, idx: number) => {
    if (!value) return;
    if (idx < 0 || idx > nodes.length) {
      setMessage("Index out of range");
      clearMessage();
      return;
    }
    for (let i = 0; i < idx; i++) {
      setHighlightIndex(i);
      await sleep(300);
    }
    setHighlightIndex(null);
    const newNode = { id: idCounter, value };
    setIdCounter((c) => c + 1);
    setNodes((prev) => {
      const ns = [...prev];
      ns.splice(idx, 0, newNode);
      return ns;
    });
  };

  const deleteHead = async () => {
    if (nodes.length === 0) {
      setMessage("List is empty");
      clearMessage();
      return;
    }
    setHighlightIndex(0);
    await sleep(300);
    setNodes((prev) => prev.slice(1));
    setHighlightIndex(null);
  };

  const deleteTail = async () => {
    if (nodes.length === 0) {
      setMessage("List is empty");
      clearMessage();
      return;
    }
    for (let i = 0; i < nodes.length; i++) {
      setHighlightIndex(i);
      await sleep(300);
    }
    setHighlightIndex(null);
    setNodes((prev) => prev.slice(0, -1));
  };

  const deleteAtIndex = async (idx: number) => {
    if (idx < 0 || idx >= nodes.length) {
      setMessage("Index out of range");
      clearMessage();
      return;
    }
    for (let i = 0; i <= idx; i++) {
      setHighlightIndex(i);
      await sleep(300);
    }
    setHighlightIndex(null);
    setNodes((prev) => {
      const ns = [...prev];
      ns.splice(idx, 1);
      return ns;
    });
  };

  const destroyList = () => {
    setNodes([]);
    setHighlightIndex(null);
    setMessage(null);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Top 80% - Visualization */}
      <div className="flex-1 p-4 overflow-auto" ref={containerRef}>
        {Array.from(
          { length: Math.ceil(nodes.length / nodesPerRow) },
          (_, rowIdx) => (
            <div key={rowIdx} className="flex items-center flex-wrap">
              {nodes
                .slice(rowIdx * nodesPerRow, (rowIdx + 1) * nodesPerRow)
                .map((node, idx) => (
                  <React.Fragment key={node.id}>
                    <Node
                      node={node}
                      isHighlighted={
                        highlightIndex === rowIdx * nodesPerRow + idx
                      }
                    />
                    {idx < nodesPerRow - 1 &&
                      rowIdx * nodesPerRow + idx < nodes.length - 1 && (
                        <Arrow />
                      )}
                  </React.Fragment>
                ))}
            </div>
          )
        )}
      </div>

      {/* Bottom 20% - Controls */}
      <div className="h-1/5 p-4 bg-white  rounded-t-2xl shadow flex flex-col gap-2 overflow-auto">
        <div className="flex flex-wrap gap-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Value"
            className="border border-black text-black p-2 rounded w-32"
          />
          <input
            type="number"
            value={targetIndex}
            onChange={(e) => setTargetIndex(e.target.value)}
            placeholder="Index"
            className="border border-black text-black p-2 rounded w-24"
          />
          <button
            onClick={() => insertAtHead(inputValue)}
            disabled={!inputValue}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Insert Head
          </button>
          <button
            onClick={() => insertAtTail(inputValue)}
            disabled={!inputValue}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Insert Tail
          </button>
          <button
            onClick={() => insertAtIndex(inputValue, Number(targetIndex))}
            disabled={!inputValue}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Insert At Index
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={deleteHead}
            disabled={nodes.length === 0}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Delete Head
          </button>
          <button
            onClick={deleteTail}
            disabled={nodes.length === 0}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Delete Tail
          </button>
          <button
            onClick={() => deleteAtIndex(Number(targetIndex))}
            disabled={nodes.length === 0}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Delete At Index
          </button>
          <button
            onClick={destroyList}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Destroy List
          </button>
        </div>

        {message && <div className="text-sm text-red-500 mt-1">{message}</div>}
      </div>
    </div>
  );
}
