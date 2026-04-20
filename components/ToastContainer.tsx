/**
 * Toast Notifications Component
 * Displays toast notifications from UI context
 */

"use client";

import { useUI, ToastType } from '../contexts/UIContext';
import { useEffect, useState } from 'react';

interface ToastItemProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: () => void;
}

function ToastItem({ id, message, type, onClose }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for fade out animation
  };

  const typeStyles = {
    success: 'bg-green-500 border-green-600',
    error: 'bg-red-500 border-red-600',
    warning: 'bg-yellow-500 border-yellow-600',
    info: 'bg-blue-500 border-blue-600',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'i',
  };

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border-l-4 text-white
        transition-all duration-300 transform
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${typeStyles[type]}
      `}
    >
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-white bg-opacity-20 rounded-full font-bold">
        {icons[type]}
      </div>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={handleClose}
        className="flex-shrink-0 w-5 h-5 flex items-center justify-center hover:bg-white hover:bg-opacity-20 rounded transition-colors"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, hideToast } = useUI();

  return (
    <div className="fixed top-4 right-4 z-[9998] flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </div>
  );
}

