'use client';

import Mod, { ModData } from "@/types/Mod";
import React, { useCallback, useEffect, useState } from "react";
import EPMod from "@/types/EPMod";
import ModsRecord from "@/types/records/ModsRecord";
import LoadedRecord from "@/types/records/LoadedVersionRecord";
import { CACHE_DURATION, STORAGE_KEYS } from "@/constants/cache";
import { API_ENDPOINTS } from "@/constants/api";
import {useMinecraftVersion} from "@/hooks/useIsDataLoaded.ts";
import {parse} from "smol-toml";

/** Возвращаемое значение хука useMods */
export interface UseModsReturn {
  /** Список модов по версиям */
  mods: ModsRecord;
  /** Статус загрузки по версиям */
  loaded: LoadedRecord;
  /** Выбранные моды по версиям */
  toggledMods: Record<string, Mod[]>;
  /** Функция загрузки данных модов */
  getModsData: () => Promise<void>;
  /** Сеттер для выбранных модов */
  setToggledMods: React.Dispatch<React.SetStateAction<Record<string, Mod[]>>>;
}

/**
 * Хук для управления модами
 * @returns Состояние и функции для работы с модами
 */
export function useMods(): UseModsReturn {
  const [mods, setMods] = useState<Record<string, Mod[]>>({});
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [checkedMods, setCheckedMods] = useState<Record<string, Mod[]>>({});

  /**
   * Конвертирует EPMod в Mod с получением размера файла
   * @param mod - Мод для конвертации
   * @param epMods - Список всех модов для поиска зависимостей
   * @param minecraftVersion - Версия Minecraft
   * @param visited - Множество посещённых модов (для защиты от циклов)
   * @returns Сконвертированный мод
   */
  const modConvert = useCallback(async (mod: EPMod, epMods: EPMod[], minecraftVersion: string, visited = new Set<string>()): Promise<Mod> => {
    if (visited.has(mod.id)) {
      console.warn(`Обнаружена циклическая зависимость для мода: ${mod.name} (${mod.id})`);
      return Mod.from({...mod, size: 0, meta: { ...mod.meta, status: "broken" }, dependencies: []});
    }

    visited.add(mod.id);
    const link = mod.links?.download;
    let len = 0;

    if (link) {
      try {
        const head = await fetch(link, { method: "HEAD" });
        len = head.ok ? parseInt(head.headers.get("Content-Length") || "0", 10) : 0;
      } catch (err) {
        console.warn(`Ошибка получения размера для ${mod.name}:`, err);
      }
    }

    let deps: Mod[] | [] = [];
    if (mod.dependencies.length > 0) {
      const promises = mod.dependencies.map(id => {
        const dep = epMods.find(mod => mod.id === id);
        if (!dep) {
          console.warn(`Зависимость с id ${id} не найдена для мода ${mod.name}`);
          return null;
        }

        return modConvert(dep, epMods, minecraftVersion, visited);
      });

      const results = await Promise.all(promises);
      deps = results.filter((d): d is Mod => d !== null);
    }

    return Mod.from({...mod, size: len / 1048576, dependencies: deps});
  }, []);

  /**
   * Загружает данные модов из API
   * @param minecraftVersion - Версия Minecraft
   * @returns Список модов
   */
  const fetchData = useCallback(async (minecraftVersion: string): Promise<Mod[]> => {
    const result = await fetch(API_ENDPOINTS.getModsJson(minecraftVersion));
    if (!result.ok) throw new Error("Ошибка загрузки модов с гитхаба");
    const data = parse(await result.text()) as { mods: any[] };
    const epMods = data.mods.map(EPMod.from)
    const modPromises = epMods.map(mod => modConvert(mod, epMods, minecraftVersion));
    return await Promise.all(modPromises);
  }, [modConvert]);

  /**
   * Загружает данные модов с учётом кэша
   */
  const getModsData = useCallback(async () => {
    const minecraftVersion = useMinecraftVersion()!;
    const cacheKey = STORAGE_KEYS.getModsKey(minecraftVersion);
    const timestampKey = STORAGE_KEYS.getModsTimestamp(minecraftVersion);
    const checkedModsKey = STORAGE_KEYS.getCheckedMods(minecraftVersion);
    const cachedMods = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(timestampKey);
    const cachedCheckedMods = sessionStorage.getItem(checkedModsKey);

    let modsData: Mod[];

    if (cachedMods && cachedTimestamp && Date.now() - parseInt(cachedTimestamp, 10) < CACHE_DURATION.MODS) {
      modsData = Mod.fromArray(JSON.parse(cachedMods) as ModData[]);
    } else {
      modsData = await fetchData(minecraftVersion);
      localStorage.setItem(cacheKey, JSON.stringify(modsData));
      localStorage.setItem(timestampKey, Date.now().toString());
    }

    setMods(prev => ({ ...prev, [minecraftVersion]: modsData }));

    if (cachedCheckedMods) {
      try {
        const savedCheckedMods = Mod.fromArray(JSON.parse(cachedCheckedMods) as ModData[]);
        setCheckedMods(prev => ({...prev, [minecraftVersion]: savedCheckedMods}));
      } catch (e) {
        console.warn("Ошибка загрузки сохраненных модов:", e);
        setCheckedMods(prev => ({...prev, [minecraftVersion]: modsData.filter(mod => mod.isRequired)}));
      }
    } else {
      setCheckedMods(prev => ({...prev, [minecraftVersion]: modsData.filter(mod => mod.isRequired)}));
    }

    setLoaded(prev => ({...prev, [minecraftVersion]: true}));
  }, [fetchData]);

  useEffect(() => {
    const minecraftVersion = useMinecraftVersion()!;
    if (checkedMods[minecraftVersion]) {
      sessionStorage.setItem(STORAGE_KEYS.getCheckedMods(minecraftVersion), JSON.stringify(checkedMods[minecraftVersion]));
    }
  }, [checkedMods]);

  return {
    mods,
    loaded,
    toggledMods: checkedMods,
    getModsData,
    setToggledMods: setCheckedMods
  };
}
