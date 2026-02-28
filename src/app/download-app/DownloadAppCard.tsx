'use client';
import {useUserOS} from "@/hooks/useUserOS.ts";
import {APP_SIZES} from "@/constants/api.ts";
import ButtonDownloadApp from "./ButtonDownloadApp.tsx";

export default function DownloadAppCard() {
  const os = useUserOS();
  const fileSize = os
    ? APP_SIZES[os.name.toUpperCase() as keyof typeof APP_SIZES]
    : APP_SIZES.WINDOWS;

  return (
    <div className="bg-purple-900 p-6 rounded-lg border border-purple-700">
      <h4 className="font-bold text-white text-lg">Скачай сейчас!</h4>
      <p className="text-gray-300 mb-4 text-sm">Доступно для&nbsp;Windows, MacOS и&nbsp;Linux</p>
      <ButtonDownloadApp/>
      <div className="flex justify-between text-xs text-gray-400 mt-3">
        <span>Версия 2.1.1</span>
        <span>~{fileSize}&nbsp;MB</span>
      </div>
    </div>
  )
}
