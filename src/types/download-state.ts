import Mod from "./Mod";
import React from "react";

/** Состояние загрузки модов */
export interface DownloadState {
  /** Список модов для загрузки */
  toggledMods: Mod[];
  /** Путь к папке игры */
  folderPath: string;
  /** Версия Minecraft */
  minecraftVersion: string;
  /** Запущено в нативном режиме (Electron) */
  isNative: boolean;
}

/** Сеттеры для обновления состояния загрузки */
export interface DownloadSetters {
  /** Установить количество загруженных модов */
  setCompletedCount: React.Dispatch<React.SetStateAction<number>>;
  /** Установить количество загруженных байт */
  setDownloadedBytes: React.Dispatch<React.SetStateAction<number>>;
  /** Установить общий размер */
  setTotalBytes: React.Dispatch<React.SetStateAction<number>>;
  /** Установить флаг загрузки */
  setIsDownload: React.Dispatch<React.SetStateAction<boolean>>;
}
