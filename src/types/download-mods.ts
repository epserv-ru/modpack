import React from "react";

/** Пропсы компонента выбора папки */
export interface LoadFolderProps {
  /** Запущено в нативном режиме (Electron) */
  isNative: boolean;
  /** Загружается */
  isLoading: boolean;
  /** Путь к выбранной папке */
  folderPath: string;
  /** Обработчик выбора папки */
  onPickFolder: () => void;
  /** Идёт загрузка */
  download: boolean;
}

/** Пропсы компонента установки IPS */
export interface IpsSetProps {
  /** Запущено в нативном режиме (Electron) */
  isNative: boolean;
  /** Загружается */
  isLoading: boolean;
  /** Установить IPS серверы */
  installIps: boolean;
  /** Обработчик изменения чекбокса */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Идёт загрузка */
  download: boolean;
}

/** Пропсы компонента прогресс-бара загрузки */
export interface DownloadBarProps {
  /** Идёт загрузка */
  download: boolean;
  /** Процент загрузки */
  percent: number;
  /** Количество загруженных модов */
  completedCount: number;
  /** Общее количество модов */
  totalCount: number;
}

/** Состояние страницы загрузки модов */
export interface DownloadModsState {
  /** Путь к папке игры */
  folderPath: string;
  /** Идёт загрузка */
  download: boolean;
  /** Установить IPS серверы */
  installIps: boolean;
  /** Количество загруженных модов */
  completedCount: number;
  /** Количество загруженных байт */
  downloadedBytes: number;
  /** Общий размер в байтах */
  totalBytes: number;
}
