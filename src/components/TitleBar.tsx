'use memo';

import NavigationButtons from "./NavigationButtons";
import WindowControls from "./WindowControls";
import { useIsNative } from "@/hooks/useIsNative";

export default function TitleBar() {
  const isNative = useIsNative();

  if (!isNative) return null;

  return (
    <div className="flex h-12 absolute w-full items-center justify-between px-2 titlebar-drag-region bg-gray-800 shadow select-none">
      <NavigationButtons />
      <WindowControls />
    </div>
  );
}
