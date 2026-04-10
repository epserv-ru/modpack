'use client';

import Logo from "@/components/Logo";
import Navigation from "@/components/Navigation";
import TitleBar from "@/components/TitleBar";
import { ModsProvider, useModsContext } from "@/components/ModsContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TextFormatter } from "@/components/TextFormatter";
import { useNavigation } from "@/components/NavigationContext";
import {useIsNative} from "@/hooks/useIsNative.ts";
import {useMinecraftVersion} from "@/hooks/useIsDataLoaded.ts";
import * as React from "react";
import {ArrowDownToBracket} from "flowbite-react-icons/outline";
import {ModsDownload} from "@/components/ModsDownload.tsx";

/**
 * Страница загрузки модов
 */
export default function Page() {
  return (
    <ModsProvider>
      <DownloadMods />
    </ModsProvider>
  );
}

/**
 * Компонент загрузки модов
 */
function DownloadMods() {
  const modsContext = useModsContext();
  const minecraftVersion = useMinecraftVersion()!;
  const isNative = useIsNative();
  const { setCanGoBack } = useNavigation();

  useEffect(() => {
    setCanGoBack(true);
  }, [setCanGoBack]);

  const [folderPath, setFolderPath] = useState('');
  const [isDownload, setIsDownload] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [downloadedBytes, setDownloadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);

  const isLoading = !modsContext.loaded[minecraftVersion];

  const toggledMods = useMemo(
    () => (!isLoading ? modsContext.toggledMods?.[minecraftVersion] ?? [] : []),
    [isLoading, minecraftVersion, modsContext.toggledMods]
  );

  const totalCount = useMemo(() => toggledMods.filter(mod => !mod.isLibrary).length, [toggledMods]);
  const percent = useMemo(
    () => totalBytes ? Math.round((downloadedBytes / totalBytes) * 100) : 0,
    [downloadedBytes, totalBytes]
  );

  const totalSize = React.useMemo(
    () => toggledMods.reduce((sum, mod) => sum + mod.size, 0).toFixed(2),
    [toggledMods]
  );

  useEffect(() => {
    if (!modsContext.loaded[minecraftVersion]) {
      modsContext.getModsData?.();
    }
  }, [minecraftVersion, modsContext]);

  useEffect(() => {
    if (isNative && !folderPath) {
      window.electronAPI?.getDefaultDir().then(setFolderPath);
    }
  }, [folderPath, isNative]);

  /**
   * Открывает диалог выбора папки
   */
  const pickFolder = useCallback(async () => {
    const dir = await window.electronAPI?.chooseDirectory();
    if (dir) setFolderPath(dir);
  }, []);

  const infoText = (
    <span className="text-base font-normal text-gray-400">
      {TextFormatter(totalCount, { one: "Выбран ", few: "Выбрано ", many: "Выбрано " })}
      {totalCount}{" "}
      {TextFormatter(totalCount, { one: "мод ", few: "мода ", many: "модов " })}
      для Minecraft Java Edition {minecraftVersion}
    </span>
  )

  const loadFolder = (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium text-white">Выберите папку игры</h3>
      <div className="flex h-11 w-134 flex-row">
        <button
          onClick={pickFolder}
          disabled={isDownload || isLoading}
          className={`h-full w-36 py-2.5 gap-2 rounded-l-lg border border-gray-600 bg-gray-600 text-sm font-medium text-white  ${isLoading ? "opacity-50" : "hover:bg-gray-500"} transition-all duration-200 ease-in-out cursor-pointer `}
        >
          Выбрать папку
        </button>
        <div className={`flex h-full w-98 px-4 py-3 items-center rounded-r-lg border border-gray-600 bg-gray-700 ${isLoading ? "opacity-50" : ""}`}>
          <span className="text-sm leading-tight font-normal text-white">{folderPath}</span>
        </div>
      </div>
      <h4 className="text-xs font-normal text-gray-400">
        В этой папке будет создана папка <span className="font-bold">mods</span>{" "}(если её нет), в неё будут загружены моды
      </h4>
    </div>
  )

  const downloadBar = (
    <div className="flex flex-col gap-1 justify-center">
      <div className="w-83 h-1.5 rounded-sm bg-gray-700">
        <div className="bg-purple-600 h-full rounded-sm transition-all duration-300" style={{ width: `${percent}%` }} />
      </div>
      <div className="flex flex-row justify-between text-xs font-medium text-gray-400">
        <span>Загружено {completedCount}/{totalCount} модов...</span>
        <span>{percent}%</span>
      </div>
    </div>
  )

  const handleClick = React.useCallback(() => {
    const state = {toggledMods, folderPath, minecraftVersion, isNative};
    const setters = {setCompletedCount, setDownloadedBytes, setTotalBytes, setIsDownload};
    setIsDownload(true);
    ModsDownload(state, setters).then();
  }, [toggledMods, folderPath, minecraftVersion, isNative, setCompletedCount, setDownloadedBytes, setTotalBytes, setIsDownload]);

  const buttonDownload = (
    <button
      disabled={isDownload || isLoading}
      onClick={handleClick}
      className={`flex h-10 items-center justify-center gap-2 rounded-lg bg-green-500 px-5 py-2.5 text-sm font-medium text-white ${isDownload || isLoading ? `opacity-50` : `hover:bg-green-600 cursor-pointer`} transition-all duration-200`}
    >
      <span>{isDownload ? "Скачивание модов..." : `Скачать моды: ~ ${totalSize} МБ ${isNative ? `` : `(.zip)`}`}</span>
      {!isDownload && <ArrowDownToBracket size={20} />}
    </button>
  );

  return (
    <>
      <TitleBar />
      <main className="flex h-screen w-screen items-center justify-center bg-gray-900 font-[Inter] select-none">
        <div className="flex w-180 flex-col gap-6 rounded-lg bg-gray-800 p-8 shadow">
          <Logo />
          <hr className="border-transparent bg-gray-700" />
          <Navigation />
          {infoText}
          {isNative && loadFolder}
          <div className="flex flex-row justify-between">
            {buttonDownload}
            {isDownload && downloadBar}
          </div>
        </div>
      </main>
    </>
  );
}
