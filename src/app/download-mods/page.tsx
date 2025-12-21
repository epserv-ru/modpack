'use client';

import Logo from "@/components/Logo";
import Navigation from "@/components/Navigation";
import TitleBar from "@/components/TitleBar";
import ButtonDownload from "@/components/buttons/ButtonDownload";
import { ModsProvider, useModsContext } from "@/components/ModsContext";
import { CheckIcon } from "flowbite-react/icons/check-icon";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TextFormatter } from "@/components/TextFormatter";
import type { DownloadBarProps, IpsSetProps, LoadFolderProps } from "@/types/download-mods";
import { STORAGE_KEYS } from "@/constants/cache";
import { useNavigation } from "@/components/NavigationContext";

const CSS = {
  main: "flex h-screen w-screen items-center justify-center bg-gray-900 font-[Inter] select-none",
  card: "flex w-[720px] flex-col gap-6 rounded-lg bg-gray-800 p-8 shadow",
  hr: "border-transparent bg-gray-700",
  infoText: "text-base font-normal text-gray-400",
  folderSection: "flex flex-col gap-2",
  folderRow: "flex h-11 w-134 flex-row",
  folderButton: "h-full w-36 cursor-pointer gap-2 rounded-l-lg border border-gray-600 bg-gray-600 py-2.5 text-sm font-medium text-white transition-all duration-250",
  folderPath: "flex h-full w-98 items-center rounded-r-lg border border-gray-600 bg-gray-700 px-4 py-3",
  folderPathText: "text-sm leading-tight font-normal text-white",
  folderHint: "text-xs font-normal text-gray-400",
  checkboxRow: "flex flex-row items-center rounded gap-2",
  checkbox: "w-4 h-4 cursor-pointer border flex justify-center items-center border-gray-600 transition-all duration-150 bg-gray-700 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600",
  checkboxIcon: "absolute w-3 h-3 text-white transition-opacity duration-150",
  checkboxLabel: "text-sm font-medium align-middle text-white",
  downloadBarContainer: "flex flex-col gap-1 justify-center",
  progressBar: "w-[332px] h-1.5 rounded-sm bg-gray-700",
  progressFill: "bg-purple-600 h-full rounded-sm transition-all duration-300",
  progressText: "flex flex-row justify-between text-xs font-medium text-gray-400",
  actionRow: "flex flex-row justify-between gap-12",
  skeleton: {
    base: "bg-gray-700 rounded animate-pulse",
    text: "h-4 bg-gray-700 rounded animate-pulse",
    button: "w-36 h-11 bg-gray-700 rounded-l-lg animate-pulse",
    path: "w-98 h-11 bg-gray-700 rounded-r-lg animate-pulse",
  },
} as const;

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
 * Получает версию Minecraft из sessionStorage
 * @returns Версия Minecraft или null
 */
function useMinecraftVersion(): string | null {
  return typeof window !== 'undefined' ? window.sessionStorage.getItem(STORAGE_KEYS.MINECRAFT_VERSION) : null;
}

/**
 * Проверяет, запущено приложение в нативном режиме (Electron)
 * @returns true если запущено в Electron
 */
function useIsNative(): boolean {
  return typeof window !== 'undefined' && !!window.electronAPI;
}

/**
 * Компонент загрузки модов
 */
function DownloadMods() {
  const modsContext = useModsContext();
  const minecraftVersion = useMinecraftVersion();
  const isNative = useIsNative();
  const { setCanGoBack } = useNavigation();

  useEffect(() => {
    setCanGoBack(true);
  }, [setCanGoBack]);

  const [folderPath, setFolderPath] = useState('');
  const [download, setDownload] = useState(false);
  const [installIps, setInstallIps] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [downloadedBytes, setDownloadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);

  const isLoading = !minecraftVersion || !modsContext.loaded[minecraftVersion];

  const checkedMods = useMemo(
    () => (!isLoading ? modsContext.checkedMods?.[minecraftVersion] ?? [] : []),
    [isLoading, minecraftVersion, modsContext.checkedMods]
  );

  const totalCount = useMemo(() => checkedMods.length, [checkedMods]);
  const percent = useMemo(
    () => totalBytes ? Math.round((downloadedBytes / totalBytes) * 100) : 0,
    [downloadedBytes, totalBytes]
  );

  useEffect(() => {
    if (minecraftVersion && !modsContext.loaded[minecraftVersion]) {
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
    if (window.electronAPI) {
      const dir = await window.electronAPI.chooseDirectory();
      if (dir) setFolderPath(dir);
    }
  }, []);

  /**
   * Обрабатывает изменение чекбокса IPS
   */
  const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInstallIps(e.target.checked);
  }, []);

  return (
    <>
      <TitleBar />
      <main className={CSS.main}>
        <div className={CSS.card}>
          <Logo />
          <hr className={CSS.hr} />
          <Navigation />
          <InfoText
            minecraftVersion={minecraftVersion}
            totalCount={totalCount}
          />
          <LoadFolder
            isNative={isNative}
            isLoading={isLoading}
            folderPath={folderPath}
            onPickFolder={pickFolder}
            download={download}
          />
          <IpsSet
            isNative={isNative}
            isLoading={isLoading}
            installIps={installIps}
            onChange={handleCheckboxChange}
            download={download}
          />
          <div className={CSS.actionRow}>
            <ButtonDownload
              checkedMods={checkedMods}
              download={download}
              isLoading={isLoading}
              setCompletedCount={setCompletedCount}
              setDownloadedBytes={setDownloadedBytes}
              setTotalBytes={setTotalBytes}
              setDownload={setDownload}
              folderPath={folderPath}
              minecraftVersion={minecraftVersion}
              installIps={installIps}
              native={isNative}
            />
            <DownloadBar
              download={download}
              percent={percent}
              completedCount={completedCount}
              totalCount={totalCount}
            />
          </div>
        </div>
      </main>
    </>
  );
}

/**
 * Компонент информации о выбранных модах
 * @param minecraftVersion - Версия Minecraft
 * @param totalCount - Количество выбранных модов
 */
function InfoText({ minecraftVersion, totalCount }: { minecraftVersion: string; totalCount: number }) {
  return (
    <span className={CSS.infoText}>
      {TextFormatter(totalCount, { one: "Выбран ", few: "Выбрано ", many: "Выбрано " })}
      {totalCount}{" "}
      {TextFormatter(totalCount, { one: "мод ", few: "мода ", many: "модов " })}
      для Minecraft Java Edition {minecraftVersion}
    </span>
  );
}

/**
 * Компонент выбора папки для нативного режима
 * @param isNative - Запущено в Electron
 * @param isLoading - В процессе загрузки
 * @param folderPath - Текущий путь к папке
 * @param onPickFolder - Обработчик выбора папки
 * @param download - Идёт загрузка
 */
function LoadFolder({ isNative, isLoading, folderPath, onPickFolder, download }: LoadFolderProps) {
  if (!isNative) return null;

  return (
    <div className={CSS.folderSection}>
      <label className="text-sm font-medium text-white">
        Выберите папку игры
      </label>
      <div className={CSS.folderRow}>
        <button
          onClick={onPickFolder}
          disabled={download || isLoading}
          className={`${CSS.folderButton} ${isLoading ? "opacity-50" : "hover:bg-gray-500"}`}
        >
          Выбрать папку
        </button>
        <div className={`${CSS.folderPath} ${isLoading ? "opacity-50" : ""}`}>
          <span className={CSS.folderPathText}>
            {folderPath}
          </span>
        </div>
      </div>
      <label className={CSS.folderHint}>
        В этой папке будет создана папка <span className="font-bold">mods</span>{" "}
        (если её нет), в неё будут загружены моды
      </label>
    </div>
  );
}

/**
 * Компонент настройки IPS для нативного режима
 * @param isNative - Запущено в Electron
 * @param isLoading - В процессе загрузки
 * @param installIps - Установить IPS серверы
 * @param onChange - Обработчик изменения
 * @param download - Идёт загрузка
 */
function IpsSet({ isNative, isLoading, installIps, onChange, download }: IpsSetProps) {
  if (!isNative) return null;

  return (
    <div className={`${CSS.checkboxRow} ${download ? 'opacity-50' : 'opacity-100'}`}>
      <input
        id="ipsSet"
        type="checkbox"
        className="peer hidden"
        checked={installIps}
        disabled={download || isLoading}
        onChange={onChange}
      />
      <label htmlFor="ipsSet" className={CSS.checkbox}>
        <CheckIcon className={`${CSS.checkboxIcon} ${installIps ? 'opacity-100' : 'opacity-0'}`} />
      </label>
      <span className={CSS.checkboxLabel}>
        Добавить в список серверов региональные адреса{' '}
        <a
          href="https://epserv.ru/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-700"
          onClick={e => { if (download) e.preventDefault(); }}
        >
          ElectroPlay
        </a>
      </span>
    </div>
  );
}

/**
 * Компонент прогресс-бара загрузки
 * @param download - Идёт загрузка
 * @param percent - Процент загрузки
 * @param completedCount - Количество загруженных модов
 * @param totalCount - Общее количество модов
 */
function DownloadBar({ download, percent, completedCount, totalCount }: DownloadBarProps) {
  if (!download) return null;

  return (
    <div className={CSS.downloadBarContainer}>
      <div className={CSS.progressBar}>
        <div className={CSS.progressFill} style={{ width: `${percent}%` }} />
      </div>
      <div className={CSS.progressText}>
        <span>Загружено {completedCount}/{totalCount} модов...</span>
        <span>{percent}%</span>
      </div>
    </div>
  );
}
