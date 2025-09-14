"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// --- HELPER COMPONENTS & ICONS ---

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-slate-200/70 dark:bg-white/10 p-3 rounded-xl ring-1 ring-slate-900/5 dark:ring-white/20 mb-6 w-max">
    {children}
  </div>
);

const CodeIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);
const EyeIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);
const ZapIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);
const SunIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2"></path>
    <path d="M12 20v2"></path>
    <path d="m4.93 4.93 1.41 1.41"></path>
    <path d="m17.66 17.66 1.41 1.41"></path>
    <path d="M2 12h2"></path>
    <path d="M20 12h2"></path>
    <path d="m6.34 17.66-1.41 1.41"></path>
    <path d="m19.07 4.93-1.41 1.41"></path>
  </svg>
);
const MoonIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
  </svg>
);

// --- ANIMATED BACKGROUND ---
const Background = () => {
  return (
    <div className="absolute inset-0 -z-50 h-full w-full bg-white dark:bg-slate-950 bg-[radial-gradient(circle_500px_at_50%_200px,#e2e8f0,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e70,transparent)]" />
  );
};

// --- PAGE SECTIONS AS COMPONENTS ---

const Header = ({
  theme,
  setTheme,
}: {
  theme: string;
  setTheme: (theme: string) => void;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`z-50 transition-all duration-300 w-full fixed top-0 ${isScrolled ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg" : "bg-transparent"}`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-teal-400 text-transparent bg-clip-text"
        >
          AlgoVisual
        </Link>
        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </motion.button>
          <motion.button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

const Hero = () => (
  <section className="relative container mx-auto px-6 py-32 text-center z-10">
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-slate-400"
    >
      Visualize Algorithms. <br /> Master Data Structures.
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 mb-10"
    >
      An interactive, modern, and blazing-fast platform to see algorithms in
      action. Understand complex concepts with intuitive visualizations.
    </motion.p>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
    >
      <Link href="/visualize" passHref>
        <motion.button
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg shadow-xl cursor-pointer relative overflow-hidden"
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 10px 30px rgba(59, 130, 246, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">Get Started</span>
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.2),transparent_80%)]"
            animate={{ scale: [1, 1.5, 1], opacity: [0, 0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.button>
      </Link>
    </motion.div>
  </section>
);

const Features = () => {
  const features = [
    {
      icon: <EyeIcon />,
      title: "Interactive Visualization",
      description:
        "Don't just read about algorithms. See them move, step-by-step. Control the speed and watch the magic unfold.",
    },
    {
      icon: <CodeIcon />,
      title: "Side-by-Side Code",
      description:
        "Understand the implementation behind the visualization. See the exact lines of code being executed in real-time.",
    },
    {
      icon: <ZapIcon />,
      title: "Blazing Fast",
      description:
        "Built with Next.js and TypeScript for a seamless, performant, and modern user experience. No lag, just learning.",
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
            Why AlgoVisual?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3 text-lg">
            Everything you need to conquer DSA.
          </p>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="bg-white dark:bg-slate-900/70 p-8 rounded-2xl ring-1 ring-slate-900/5 dark:ring-white/10 backdrop-blur-md"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 300 },
              }}
            >
              <IconWrapper>{feature.icon}</IconWrapper>
              <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Showcase = () => {
  const ds = [
    "Array",
    "Stack",
    "Queue",
    "Linked List",
    "Tree",
    "Graph",
    "Heap",
  ];
  const algos = [
    "Bubble Sort",
    "Quick Sort",
    "Merge Sort",
    "Binary Search",
    "Dijkstra's",
    "BFS",
    "DFS",
  ];
  const Ticker = ({
    items,
    direction = "left",
  }: {
    items: string[];
    direction?: "left" | "right";
  }) => (
    <div className="w-full overflow-hidden">
      <motion.div
        className="flex gap-4"
        animate={{
          x: direction === "left" ? ["0%", "-100%"] : ["-100%", "0%"],
        }}
        transition={{ ease: "linear", duration: 20, repeat: Infinity }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="py-2 px-6 bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full font-medium whitespace-nowrap ring-1 ring-slate-900/5 dark:ring-white/10"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );

  return (
    <section
      id="showcase"
      className="py-20 sm:py-28 bg-slate-100/50 dark:bg-slate-900/70 ring-1 ring-slate-900/5 dark:ring-white/10"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
            What You Can Visualize
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3 text-lg">
            A growing library of essential data structures and algorithms.
          </p>
        </div>
        <div className="space-y-6">
          <Ticker items={ds} />
          <Ticker items={algos} direction="right" />
        </div>
      </div>
    </section>
  );
};

const About = () => (
  <section id="about" className="py-20 sm:py-28">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
        Ready to Start Learning?
      </h2>
      <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 mb-10">
        Stop struggling with complex topics. Start visualizing and build a solid
        foundation in computer science today.
      </p>
      <Link href="/visualize" passHref>
        <motion.button
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg shadow-xl cursor-pointer"
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 10px 30px rgba(59, 130, 246, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          Explore Visualizers
        </motion.button>
      </Link>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-slate-200 dark:border-white/10 mt-20">
    <div className="container mx-auto px-6 py-8 text-center text-slate-500 dark:text-slate-400">
      <p>&copy; {new Date().getFullYear()} AlgoVisual. All rights reserved.</p>
      <p className="mt-2">Designed and built with ❤️ by Dhiraj Kumar.</p>
    </div>
  </footer>
);

// --- MAIN PAGE COMPONENT ---

export default function LandingPage() {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (theme) {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  if (!theme) {
    return null; // Render nothing until the theme is determined to prevent FOUC
  }

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-300 min-h-screen font-sans transition-colors duration-300 overflow-x-hidden">
      <Background />
      <Header theme={theme} setTheme={setTheme} />
      <main className="pt-24">
        <Hero />
        <Features />
        <Showcase />
        <About />
      </main>
      <Footer />
    </div>
  );
}
