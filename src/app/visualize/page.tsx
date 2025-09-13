"use client";

import React from "react";

export default function VisualizerPage() {
  return (
    <div className="w-full h-full">
      <div className="h-full flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome to AlgoVisualizer
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Select an algorithm or data structure from the sidebar to start
              visualizing how they work.
            </p>
            <div className="md:hidden bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
              <p>💡 Tap the menu icon in the top-right to explore algorithms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
