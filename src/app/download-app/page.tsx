'use client';
import AppBonusesCard from "./AppBonusesCard.tsx";
import AppInstructionCard from "./AppInstructionCard.tsx";
import ButtonClose from "./ButtonClose.tsx";
import AdditionalInfoCard from "./AdditionalInfoCard.tsx";
import DownloadAppCard from "./DownloadAppCard.tsx";
import TitleBar from "@/components/TitleBar";

export default function Page() {
  return (
    <>
      <TitleBar />
      <main className="flex h-screen w-screen items-center justify-center bg-gray-900 font-[Inter] pt-8">
        <div className="flex flex-col rounded-lg max-w-4xl gap-4 bg-gray-800 p-8 shadow-2xl">
        <div className="flex flex-col justify-between gap-1">
         <div className="flex flex-row justify-between">
           <h2 className="text-2xl font-semibold text-white">EPmodpack App</h2>
           <ButtonClose />
         </div>
          <p className="text-gray-400">Удобная установка модов прямо в игру</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-flow-row gap-4">
            <AppBonusesCard/>
            <AdditionalInfoCard/>
          </div>
          <div className="grid grid-flow-row gap-4">
            <AppInstructionCard/>
            <DownloadAppCard/>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}