'use client';

import { Close, Minus } from "flowbite-react-icons/outline";
import { Square } from "lucide-react";
import { useMemo } from "react";

export default function WindowControls() {
  const api = typeof window !== "undefined" ? window.electronAPI : null;
  const baseBtnClass = "flex h-8 w-8 items-center justify-center rounded text-gray-400 hover:text-white transition-all duration-200 ease-in-out cursor-pointer";
  const controls = useMemo(() => [
    {
      icon: <Minus size={20} />,
      onClick: () => api?.minimizeWindow(),
      hover: "hover:bg-gray-700",
      label: "Свернуть"
    },
    {
      icon: <Square size={16} />,
      onClick: () => api?.maximizeWindow(),
      hover: "hover:bg-gray-700",
      label: "Развернуть"
    },
    {
      icon: <Close size={20} />,
      onClick: () => api?.closeWindow(),
      hover: "hover:bg-red-600",
      label: "Закрыть"
    },
  ], [api]);

  return (
    <div className="flex gap-2 titlebar-no-drag">
      {controls.map((ctrl, i) => (
        <button
          key={i}
          title={ctrl.label}
          aria-label={ctrl.label}
          className={`${baseBtnClass} ${ctrl.hover}`}
          onClick={ctrl.onClick}
        >
          {ctrl.icon}
        </button>
      ))}
    </div>
  )
}
