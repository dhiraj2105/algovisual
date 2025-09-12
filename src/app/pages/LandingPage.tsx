"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// --- Helper Components (SVG Icons) ---

const CodeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const ZapIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

// --- Main Page Component ---

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Data for sections
  const dataStructures = [
    "Array",
    "Stack",
    "Queue",
    "Linked List",
    "Tree",
    "Graph",
  ];
  const algorithms = [
    "Bubble Sort",
    "Quick Sort",
    "Merge Sort",
    "Binary Search",
    "Dijkstra's",
    "A* Search",
  ];

  // Animated text for hero
  const animatedText = "Visualize".split("");
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
      },
    }),
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen font-sans transition-colors duration-300 overflow-x-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`z-50 transition-all duration-300 w-full md:w-4/5 md:mx-auto left-0 right-0 ${
          isScrolled
            ? "fixed top-0 md:top-4 md:rounded-xl bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/80"
            : "absolute top-0"
        }`}
      >
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-teal-400 text-transparent bg-clip-text"
          >
            AlgoVisual
          </Link>

          <div className="flex items-center">
            <motion.button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg shadow-lg text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          </div>
        </div>
      </motion.header>

      <main className="pt-24">
        {/* Hero Section */}
        <motion.section
          className="container mx-auto px-6 py-16 sm:py-20 text-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          <div className="absolute inset-0 -z-1 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_3rem] sm:bg-[size:6rem_4rem]">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3b82f633,transparent)]"></div>
          </div>

          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4 tracking-tighter"
          >
            <motion.div
              className="inline-block"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } },
              }}
            >
              {animatedText.map((letter, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  variants={textVariants}
                  custom={i}
                >
                  <motion.span
                    className="inline-block"
                    animate={{
                      y: [0, -8, 0],
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                        delay: i * 0.1,
                      },
                    }}
                  >
                    {letter}
                  </motion.span>
                </motion.span>
              ))}
            </motion.div>{" "}
            Algorithms.
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-teal-400 text-transparent bg-clip-text">
              Master Data Structures.
            </span>
          </motion.h2>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 mb-8"
          >
            An interactive, modern, and blazing-fast platform to see algorithms
            in action. Understand complex concepts with intuitive
            visualizations.
          </motion.p>
          <motion.button
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-xl cursor-pointer"
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 8px 25px rgba(59, 130, 246, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              window.location.href = "/visualize";
            }}
          >
            Get Started
          </motion.button>
        </motion.section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl sm:text-4xl font-bold">
                Why AlgoVisual?
              </h3>
              <p className="text-gray-600 mt-2">
                Everything you need to conquer DSA.
              </p>
            </div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{
                visible: { transition: { staggerChildren: 0.2 } },
              }}
            >
              <motion.div
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-2xl transition-shadow duration-300 ring-1 ring-gray-900/5"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{
                  y: -8,
                  boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="bg-blue-100 text-blue-600 rounded-full p-3 w-max mb-4">
                  <EyeIcon className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold mb-2">
                  Interactive Visualization
                </h4>
                <p className="text-gray-600">
                  Do not just read about algorithms. See them move,
                  step-by-step. Control the speed and watch the magic unfold.
                </p>
              </motion.div>
              <motion.div
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-2xl transition-shadow duration-300 ring-1 ring-gray-900/5"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{
                  y: -8,
                  boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="bg-teal-100 text-teal-600 rounded-full p-3 w-max mb-4">
                  <CodeIcon className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold mb-2">Side-by-Side Code</h4>
                <p className="text-gray-600">
                  Understand the implementation behind the visualization. See
                  the exact lines of code being executed in real-time.
                </p>
              </motion.div>
              <motion.div
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-2xl transition-shadow duration-300 ring-1 ring-gray-900/5"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{
                  y: -8,
                  boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="bg-purple-100 text-purple-600 rounded-full p-3 w-max mb-4">
                  <ZapIcon className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold mb-2">Blazing Fast</h4>
                <p className="text-gray-600">
                  Built with Next.js and TypeScript for a seamless, performant,
                  and modern user experience. No lag, just learning.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Supported DS & A Section */}
        <section id="visualizer" className="py-16 sm:py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h3 className="text-3xl sm:text-4xl font-bold">
                What You Can Visualize
              </h3>
              <p className="text-gray-600 mt-2">
                A growing library of essential data structures and algorithms.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h4 className="text-2xl font-semibold mb-6 text-center">
                  Data Structures
                </h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {dataStructures.map((ds, i) => (
                    <motion.span
                      key={ds}
                      className="py-2 px-4 bg-gray-100 text-gray-700 rounded-full font-medium"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      {ds}
                    </motion.span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-semibold mb-6 text-center">
                  Algorithms
                </h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {algorithms.map((algo, i) => (
                    <motion.span
                      key={algo}
                      className="py-2 px-4 bg-gray-100 text-gray-700 rounded-full font-medium"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      {algo}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-center mt-10 text-gray-500">
              ...and many more coming soon!
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section id="about" className="py-16 sm:py-20 bg-gray-50">
          <div className="container mx-auto px-6 text-center">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Start Learning?
            </h3>
            <p className="max-w-xl mx-auto text-lg text-gray-600 mb-8">
              Stop struggling with complex topics. Start visualizing and build a
              solid foundation in computer science today.
            </p>
            <motion.button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-xl"
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 8px 25px rgba(59, 130, 246, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Now
            </motion.button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="container mx-auto px-6 py-8 text-center text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} AlgoVisual. All rights reserved.
          </p>
          <p className="mt-2">
            Designed and built with ❤️ for students and developers by Dhiraj
            Kumar.
          </p>
        </div>
      </footer>
    </div>
  );
}
