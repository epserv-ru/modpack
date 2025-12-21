'use client';

import { Close, Minus } from "flowbite-react-icons/outline";
import { Square } from "lucide-react";

export default function WindowControls() {
  const handleMinimize = () => {
    (window as any).electronAPI?.minimizeWindow();
  };

  const handleMaximize = () => {
    (window as any).electronAPI?.maximizeWindow();
  };

  const handleClose = () => {
    (window as any).electronAPI?.closeWindow();
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleMinimize}
        className="h-8 w-8 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 rounded cursor-pointer"
      >
        <Minus size={20} />
      </button>
      <button
        onClick={handleMaximize}
        className="h-8 w-8 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 rounded cursor-pointer"
      >
        <Square size={16} />
      </button>
      <button
        onClick={handleClose}
        className="h-8 w-8 hover:bg-red-600 flex items-center justify-center text-gray-400 hover:text-white transition-colors duration-200 rounded cursor-pointer"
      >
        <Close size={20} />
      </button>
    </div>
  );
}
