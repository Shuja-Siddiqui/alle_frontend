/**
 * Global Loader Component
 * Displays a loading spinner when UI context isLoading is true
 */

"use client";

import { useUI } from '../contexts/UIContext';

export function GlobalLoader() {
  const { isLoading, loadingMessage } = useUI();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        
        {/* Loading message */}
        {loadingMessage && (
          <p className="text-gray-700 dark:text-gray-300 font-medium text-center">
            {loadingMessage}
          </p>
        )}
      </div>
    </div>
  );
}

