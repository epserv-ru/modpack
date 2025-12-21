'use client';

import { useEffect, useState } from "react";
import NavigationButtons from "./NavigationButtons";
import WindowControls from "./WindowControls";

export default function TitleBar() {
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    const electron = typeof window !== 'undefined' && (window as any).electronAPI;
    setIsElectron(!!electron);
  }, []);

  if (!isElectron) return null;

  return (
    <div className="flex titlebar-drag-region h-12 bg-gray-800 absolute w-full items-center justify-between px-2 shadow select-none">
      <NavigationButtons />
      <div className="titlebar-no-drag flex items-center h-full">
        <WindowControls />
      </div>
    </div>
  );
}
