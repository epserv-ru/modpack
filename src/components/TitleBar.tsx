'use client';

import NavigationButtons from "./NavigationButtons";
import WindowControls from "./WindowControls";
import { useIsNative } from "@/hooks/useIsNative";

export default function TitleBar() {
  const isNative = useIsNative();

  if (!isNative) return null;

  return (
    <div className="flex titlebar-drag-region h-12 bg-gray-800 absolute w-full items-center justify-between px-2 shadow select-none">
      <NavigationButtons />
      <div className="titlebar-no-drag flex items-center h-full">
        <WindowControls />
      </div>
    </div>
  );
}
