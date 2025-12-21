'use client';

import Mod from "@/types/Mod";
import React, { useCallback, useEffect, useState } from "react";
import EPMod from "@/types/EPMod";
import ModsRecord from "@/types/records/ModsRecord";
import LoadedRecord from "@/types/records/LoadedVersionRecord";
import { CACHE_DURATION, STORAGE_KEYS } from "@/constants/cache";
import { API_ENDPOINTS } from "@/constants/api";

/** Возвращаемое значение хука useMods */
export interface UseModsReturn {
  /** Список модов по версиям */
  mods: ModsRecord;
  /** Статус загрузки по версиям */
  loaded: LoadedRecord;
  /** Выбранные моды по версиям */
  checkedMods: Record<string, Mod[]>;
  /** Функция загрузки данных модов */
  getModsData: () => Promise<void>;
  /** Сеттер для выбранных модов */
  setCheckedMods: React.Dispatch<React.SetStateAction<Record<string, Mod[]>>>;
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
  const modConvert = useCallback(async (
    mod: EPMod,
    epMods: EPMod[],
    minecraftVersion: string,
    visited = new Set<string>()
  ): Promise<Mod> => {
    if (visited.has(mod.id)) {
      console.warn(`Обнаружена циклическая зависимость для мода: ${mod.name} (${mod.id})`);
      return {
        id: mod.id,
        name: mod.name,
        purpose: mod.purpose,
        description: mod.description,
        size: 0,
        icon_url: mod.icon_url,
        site: mod.site_link,
        required: mod.required,
        recommended: mod.recommended,
        library: mod.library,
        broken: true,
        available: false,
        reliable_link: null,
        dependencies: null
      } as Mod;
    }

    visited.add(mod.id);
    const link = mod.download_link;
    let len = 0;

    if (link) {
      try {
        const head = await fetch(link, { method: "HEAD" });
        len = head.ok ? parseInt(head.headers.get("Content-Length") || "0", 10) : 0;
      } catch (err) {
        console.warn(`Ошибка получения размера для ${mod.name}:`, err);
      }
    }

    let deps: Mod[] | null = null;
    if (mod.dependencies?.length) {
      const promises = mod.dependencies.map(id => {
        const dep = epMods.find(m => m.id === id);
        if (!dep) {
          console.warn(`Зависимость с id ${id} не найдена для мода ${mod.name}`);
          return null;
        }
        // Передаём тот же Set, а не создаём новый
        return modConvert(dep, epMods, minecraftVersion, visited);
      });

      const results = await Promise.all(promises);
      deps = results.filter((d): d is Mod => d !== null);
    }

    return {
      id: mod.id,
      name: mod.name,
      purpose: mod.purpose,
      description: mod.description,
      size: len / 1048576,
      icon_url: mod.icon_url,
      site: mod.site_link,
      required: mod.required,
      recommended: mod.recommended,
      library: mod.library,
      broken: mod.broken,
      available: !!link,
      reliable_link: link,
      dependencies: deps
    } as Mod;
  }, []);

  /**
   * Загружает данные модов из API
   * @param minecraftVersion - Версия Minecraft
   * @returns Список модов
   */
  const fetchData = useCallback(async (minecraftVersion: string): Promise<Mod[]> => {
    const result = await fetch(API_ENDPOINTS.getModsJson(minecraftVersion));
    if (!result.ok) throw new Error("Ошибка загрузки модов с гитхаба");
    const epMods = (await result.json() as EPMod[]);
    const modPromises = epMods.map(mod => modConvert(mod, epMods, minecraftVersion));
    return await Promise.all(modPromises);
  }, [modConvert]);

  /**
   * Загружает данные модов с учётом кэша
   */
  const getModsData = useCallback(async () => {
    const minecraftVersion = window.sessionStorage.getItem(STORAGE_KEYS.MINECRAFT_VERSION);
    if (!minecraftVersion) {
      console.warn("minecraftVersion не найден в sessionStorage");
      return;
    }

    const cacheKey = STORAGE_KEYS.getModsKey(minecraftVersion);
    const timestampKey = STORAGE_KEYS.getModsTimestamp(minecraftVersion);
    const checkedModsKey = STORAGE_KEYS.getCheckedMods(minecraftVersion);

    const cachedMods = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(timestampKey);
    const cachedCheckedMods = sessionStorage.getItem(checkedModsKey);

    let modsData: Mod[];

    if (cachedMods && cachedTimestamp && Date.now() - parseInt(cachedTimestamp, 10) < CACHE_DURATION.MODS) {
      modsData = JSON.parse(cachedMods) as Mod[];
    } else {
      modsData = await fetchData(minecraftVersion);
      localStorage.setItem(cacheKey, JSON.stringify(modsData));
      localStorage.setItem(timestampKey, Date.now().toString());
    }

    setMods(prev => ({...prev, [minecraftVersion]: modsData}));

    if (cachedCheckedMods) {
      try {
        const savedCheckedMods = JSON.parse(cachedCheckedMods) as Mod[];
        setCheckedMods(prev => ({...prev, [minecraftVersion]: savedCheckedMods}));
      } catch (e) {
        console.warn("Ошибка загрузки сохраненных модов:", e);
        setCheckedMods(prev => ({
          ...prev,
          [minecraftVersion]: modsData.filter(mod => mod.required && mod.available)
        }));
      }
    } else {
      setCheckedMods(prev => ({
        ...prev,
        [minecraftVersion]: modsData.filter(mod => mod.required && mod.available)
      }));
    }

    setLoaded(prev => ({...prev, [minecraftVersion]: true}));
  }, [fetchData]);

  useEffect(() => {
    const minecraftVersion = window.sessionStorage.getItem(STORAGE_KEYS.MINECRAFT_VERSION);
    if (minecraftVersion && checkedMods[minecraftVersion]) {
      sessionStorage.setItem(STORAGE_KEYS.getCheckedMods(minecraftVersion), JSON.stringify(checkedMods[minecraftVersion]));
    }
  }, [checkedMods]);

  return {
    mods,
    loaded,
    checkedMods,
    getModsData,
    setCheckedMods
  };
}
