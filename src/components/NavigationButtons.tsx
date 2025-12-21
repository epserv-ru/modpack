'use client';

import { ArrowLeft } from "flowbite-react-icons/outline";
import { useRouter } from "next/navigation";
import { Tooltip } from "@/components/Tooltip.tsx";
import { useNavigation } from "@/components/NavigationContext";

export default function NavigationButtons() {
  const router = useRouter();
  const { canGoBack } = useNavigation();

  const backButton = (
    <button
      onClick={() => { router.back() }}
      disabled={!canGoBack}
      className={`rounded p-1 text-gray-400 transition-all ${canGoBack ? "cursor-pointer hover:bg-gray-700 hover:text-white" : "opacity-50"}`}
    >
      <ArrowLeft size={20} />
    </button>
  );

  return (
    <div className="titlebar-no-drag flex items-center gap-1">
      {canGoBack ? (
        <Tooltip
          content={
            <div className="translate-x-5 justify-center rounded-lg border border-gray-600 bg-gray-700">
              <span className="m-4 text-sm font-semibold text-white">Назад</span>
            </div>
          }
          placement="bottom"
          showArrow={false}
        >
          {backButton}
        </Tooltip>
      ) : (
        <span>{backButton}</span>
      )}
    </div>
  );
}
