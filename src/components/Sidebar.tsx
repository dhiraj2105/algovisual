"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

// --- SVG Icons ---
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const DotIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12.1" cy="12.1" r="1" />
  </svg>
);

// --- Navigation Data ---
const navigationItems = [
  {
    category: "Basics",
    items: [
      { name: "For Loop", path: "/visualize/basics/for-loop" },
      { name: "While Loop", path: "/visualize/basics/while-loop" },
      { name: "Star Patterns", path: "/visualize/basics/star-patterns" },
    ],
  },
  {
    category: "Data Structures",
    items: [
      { name: "Array", path: "/visualize/data-structures/array" },
      { name: "Stack", path: "/visualize/data-structures/stack" },
      { name: "Linear Queue", path: "/visualize/data-structures/linear-queue" },
      {
        name: "Circular Queue",
        path: "/visualize/data-structures/circular-queue",
      },
      {
        name: "Priority Queue",
        path: "/visualize/data-structures/priority-queue",
      },
      {
        name: "Double Ended Queue",
        path: "/visualize/data-structures/double-ended-queue",
      },
      {
        name: "Singly Linked List",
        path: "/visualize/data-structures/singly-linked-list",
      },
      {
        name: "Doubly Linked List",
        path: "/visualize/data-structures/doubly-linked-list",
      },
      {
        name: "Circular Linked List",
        path: "/visualize/data-structures/circular-linked-list",
      },
      {
        name: "Binary Search Tree",
        path: "/visualize/data-structures/binary-search-tree",
      },
      {
        name: "Undirected Graph",
        path: "/visualize/data-structures/undirected-graph",
      },
    ],
  },
  {
    category: "Algorithms",
    items: [
      {
        name: "Sorting",
        subItems: [
          { name: "Bubble Sort", path: "/visualize/sorting/bubble-sort" },
          { name: "Quick Sort", path: "/visualize/sorting/quick-sort" },
          { name: "Merge Sort", path: "/visualize/sorting/merge-sort" },
          { name: "Selection Sort", path: "/visualize/sorting/selection-sort" },
          { name: "Insertion Sort", path: "/visualize/sorting/insertion-sort" },
          { name: "Heap Sort", path: "/visualize/sorting/heap-sort" },
          { name: "Radix Sort", path: "/visualize/sorting/radix-sort" },
        ],
      },
      {
        name: "Searching",
        subItems: [
          { name: "Linear Search", path: "/visualize/searching/linear-search" },
          { name: "Binary Search", path: "/visualize/searching/binary-search" },
        ],
      },
      { name: "DFS", path: "/visualize/algorithms/dfs" },
      { name: "BFS", path: "/visualize/algorithms/bfs" },
    ],
  },
];

// --- Sidebar Component ---
const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {
      "Data Structures": true,
      Algorithms: true,
    },
  );
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleSubMenu = (itemName: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const handleNavigate = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 fixed top-4 left-4 z-40"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-72 h-full bg-white md:relative md:w-72 md:h-auto md:translate-x-0 border-r border-gray-200 flex-shrink-0 flex flex-col z-30"
          >
            <div className="p-4 border-b border-gray-200">
              <Link
                href="/"
                className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-teal-400 text-transparent bg-clip-text"
              >
                AlgoVisual
              </Link>
            </div>
            <nav className="flex-grow p-4 overflow-y-auto">
              <ul>
                {navigationItems.map(({ category, items }) => (
                  <li key={category} className="mb-4">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      {category}
                      <motion.span
                        animate={{ rotate: openCategories[category] ? 180 : 0 }}
                      >
                        <ChevronDownIcon />
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {openCategories[category] && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-2"
                        >
                          {items.map((item) => (
                            <li key={item.name} className="mt-2">
                              {item.subItems ? (
                                <>
                                  <button
                                    onClick={() => toggleSubMenu(item.name)}
                                    className="w-full flex justify-between items-center text-gray-700 hover:text-blue-600 transition-colors py-1"
                                  >
                                    <span>{item.name}</span>
                                    <motion.span
                                      animate={{
                                        rotate: openSubMenus[item.name]
                                          ? 180
                                          : 0,
                                      }}
                                    >
                                      <ChevronDownIcon className="w-4 h-4" />
                                    </motion.span>
                                  </button>

                                  <AnimatePresence>
                                    {openSubMenus[item.name] && (
                                      <motion.ul
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden pl-4"
                                      >
                                        {item.subItems.map((subItem) => {
                                          const isActive =
                                            pathname === subItem.path;
                                          return (
                                            <li
                                              key={subItem.name}
                                              className="mt-1"
                                            >
                                              <Link
                                                href={subItem.path}
                                                className={`flex items-center w-full text-left px-4 py-2 rounded-md transition-colors ${
                                                  isActive
                                                    ? "bg-blue-100 text-blue-700 font-medium"
                                                    : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                                onClick={handleNavigate}
                                              >
                                                <DotIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                                {subItem.name}
                                              </Link>
                                            </li>
                                          );
                                        })}
                                      </motion.ul>
                                    )}
                                  </AnimatePresence>
                                </>
                              ) : (
                                <Link
                                  href={item.path || "#"}
                                  className={`flex items-center p-2 text-sm rounded-md ${
                                    pathname === item.path
                                      ? "bg-blue-50 text-blue-600 font-medium"
                                      : "text-gray-700 hover:bg-gray-100"
                                  }`}
                                  onClick={handleNavigate}
                                >
                                  <DotIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                  {item.name}
                                </Link>
                              )}
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
