'use client';

import { Download, Folder, Server, ShieldCheck } from "flowbite-react-icons/solid";
import ButtonMore from "./ButtonMore.tsx";
import ButtonBuild from "./ButtonBuild.tsx";
import InfoCard from "./InfoCard.tsx";
import TitleBar from "@/components/TitleBar";
import { useIsNative } from "@/hooks/useIsNative";

export default function Page() {
  const isNative = useIsNative();
  return (
    <>
      <TitleBar />
      <main className="flex h-screen w-screen items-center justify-center bg-gray-900 font-[Inter]">
        <div className="flex w-screen h-screen items-center justify-center bg-gray-900 font-inter select-none">
        <div className="flex w-[720px] flex-col justify-around items-center gap-5 rounded-lg bg-gray-800 p-8 shadow-2xl">
          <p className="flex justify-center text-2xl font-semibold text-white">Что такое EPmodpack?</p>
            <div className="flex flex-col justify-center gap-6">
              <div className="flex items-start p-4 bg-gray-700 rounded-lg border border-gray-600">
                <ShieldCheck className="text-green-400 mt-0.5" size={20} />
                <div>
                  <h4 className="ml-2 font-semibold text-white">Только разрешенные моды</h4>
                  <p className="ml-2 text-sm mt-1 text-gray-300">Все моды здесь разрешены для&nbsp;использования на&nbsp;сервере ElectroPlay</p>
                </div>
              </div>

              <p className="text-center text-gray-300 leading-relaxed">
                Соберите свою сборку модов или используйте базовую&nbsp;— всё уже настроено для&nbsp;комфортной игры!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoCard icon={<Server size={32} className="mx-auto text-blue-400" />} title={"Выбери версию"} description={"Актуальные версии Minecraft"}/>
                <InfoCard icon={<Folder size={32} className="mx-auto text-green-400" />} title={"Выбери моды"} description={"Базовые + дополнительные"}/>
                <InfoCard icon={<Download size={32} className="mx-auto text-purple-400" />} title={"Скачай архив"} description={"Распакуй в папку mods"}/>
              </div>

              {!isNative && (
                <div className="flex flex-col gap-3 p-4 rounded-lg border bg-blue-900 border-blue-700">
                  <p className="font-semibold flex items-center text-white">
                    <Download className="mr-2" />
                    У модпака есть приложение!
                  </p>
                  <p className="text-sm text-gray-300">Хочешь упростить установку? Скачай наше приложение:</p>
                  <ul className="flex flex-col text-sm gap-1 text-gray-300">
                    <li>• Моды устанавливаются автоматически в&nbsp;выбранную папку</li>
                    <li>• IP прокси ElectroPlay добавляются в&nbsp;список автоматически</li>
                    <li>• Не&nbsp;нужно распаковывать архивы вручную</li>
                  </ul>
                  <ButtonMore />
                </div>
              )}
              <ButtonBuild />
            </div>
          </div>
      </div>
    </main>
    </>
  );
}