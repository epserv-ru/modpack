import Mod from "./Mod";
import React from "react";

/** Состояние загрузки модов */
export interface DownloadState {
  /** Список модов для загрузки */
  checkedMods: Mod[];
  /** Путь к папке игры */
  folderPath: string;
  /** Установить IPS серверы */
  installIps: boolean;
  /** Версия Minecraft */
  minecraftVersion: string;
  /** Запущено в нативном режиме (Electron) */
  native: boolean;
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
  setDownload: React.Dispatch<React.SetStateAction<boolean>>;
}

/** Полные пропсы для кнопки загрузки */
export interface DownloadButtonProps extends DownloadState, DownloadSetters {
  /** Идёт загрузка */
  download: boolean;

  isLoading: boolean;
}

/** Вычисляемые значения на основе состояния загрузки */
export interface DownloadComputedValues {
  /** Общий размер модов */
  totalSize: number;
  /** Идёт загрузка */
  download: boolean;
}
