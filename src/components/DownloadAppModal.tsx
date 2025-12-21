'use client';

import { Close } from "flowbite-react-icons/outline";
import AppBonusesCard from "@/app/download-app/AppBonusesCard";
import AppInstructionCard from "@/app/download-app/AppInstructionCard";
import AdditionalInfoCard from "@/app/download-app/AdditionalInfoCard";
import DownloadAppCard from "@/app/download-app/DownloadAppCard";

const CSS = {
  modalOverlay: "fixed inset-0 bg-black/75 backdrop-blur-[2px] flex items-center justify-center z-40",
  modalContainer: "flex flex-col rounded-lg max-w-4xl gap-4 bg-gray-800 p-8 shadow-2xl max-h-[90vh] overflow-y-auto",
  header: "flex flex-col justify-between gap-1",
  headerTop: "flex flex-row justify-between",
  title: "text-2xl font-semibold text-white",
  subtitle: "text-gray-400",
  closeButton: "bider border-blue-500 cursor-pointer text-gray-400 hover:text-white transition-colors",
  grid: "grid grid-cols-2 gap-4",
  leftColumn: "grid grid-flow-row gap-4",
  rightColumn: "grid grid-flow-row gap-4",
} as const;

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DownloadAppModal({ isOpen, onClose }: DownloadAppModalProps) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={CSS.modalOverlay} onClick={handleOverlayClick}>
      <div className={CSS.modalContainer} onClick={e => e.stopPropagation()}>
        <div className={CSS.header}>
          <div className={CSS.headerTop}>
            <h2 className={CSS.title}>EPmodpack App</h2>
            <button onClick={onClose} className={CSS.closeButton}>
              <Close size={28} />
            </button>
          </div>
          <p className={CSS.subtitle}>Удобная установка модов прямо в игру</p>
        </div>

        <div className={CSS.grid}>
          <div className={CSS.leftColumn}>
            <AppBonusesCard />
            <AdditionalInfoCard />
          </div>
          <div className={CSS.rightColumn}>
            <AppInstructionCard />
            <DownloadAppCard />
          </div>
        </div>
      </div>
    </div>
  );
}
