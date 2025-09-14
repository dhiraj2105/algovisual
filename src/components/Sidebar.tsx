"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
    category: "Data Structures",
    items: [
      { name: "Array" },
      { name: "Stack" },
      { name: "Linear Queue" },
      { name: "Circular Queue" },
      { name: "Priority Queue" },
      { name: "Double Ended Queue" },
      { name: "Singly Linked List" },
      { name: "Doubly Linked List" },
      { name: "Circular Linked List" },
      { name: "Binary Search Tree" },
      { name: "Undirected Graph" },
    ],
  },
  {
    category: "Algorithms",
    items: [
      {
        name: "Sorting",
        subItems: [
          { name: "Bubble Sort" },
          { name: "Quick Sort" },
          { name: "Merge Sort" },
        ],
      },
      {
        name: "Searching",
        subItems: [{ name: "Linear Search" }, { name: "Binary Search" }],
      },
      { name: "DFS" },
      { name: "BFS" },
    ],
  },
];

// --- Sidebar Component ---
interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const pathname = usePathname();
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {
      "Data Structures": true,
      Algorithms: true,
    }
  );
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

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

  // --- Helper: Create link paths from names ---
  const toPath = (main: string, sub?: string) => {
    const format = (s: string) => s.toLowerCase().replace(/\s+/g, "-");
    return sub
      ? `/visualize/${format(main)}/${format(sub)}`
      : `/visualize/${format(main)}`;
  };

  // Handle navigation and close menu if on mobile
  const handleNavigation = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <aside className="w-full h-full bg-white md:bg-gray-50 border-r border-gray-200 flex-shrink-0 flex flex-col z-20">
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
                                  rotate: openSubMenus[item.name] ? 180 : 0,
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
                                    const linkPath = toPath(
                                      item.name,
                                      subItem.name
                                    );
                                    const isActive = pathname === linkPath;

                                    return (
                                      <li key={subItem.name} className="mt-1">
                                        <Link
                                          href={linkPath}
                                          className={`flex items-center w-full text-left px-4 py-2 rounded-md transition-colors ${
                                            isActive
                                              ? "bg-blue-100 text-blue-700 font-medium"
                                              : "text-gray-600 hover:bg-gray-100"
                                          }`}
                                          onClick={onNavigate}
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
                            href={toPath(category, item.name)}
                            className={`flex items-center p-2 text-sm rounded-md ${
                              pathname === toPath(category, item.name)
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              toggleSubMenu(item.name);
                              handleNavigation();
                            }}
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
    </aside>
  );
};

export default Sidebar;
