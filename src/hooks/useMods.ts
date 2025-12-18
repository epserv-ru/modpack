'use client';
import Mod from "@/types/Mod.tsx";
import React, { useCallback, useState } from "react";
import EPMod from "@/types/EPMod.tsx";
import ModsRecord from "@/types/records/ModsRecord.tsx";
import LoadedRecord from "@/types/records/LoadedVersionRecord.tsx";

export interface UseModsReturn {
  mods: ModsRecord;
  loaded: LoadedRecord;
  checkedMods: Record<string, Mod[]>;
  getModsData: () => Promise<void>;
  setCheckedMods: React.Dispatch<React.SetStateAction<Record<string, Mod[]>>>;
}

export function useMods(): UseModsReturn {
  const [mods, setMods] = useState<Record<string, Mod[]>>({});
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [checkedMods, setCheckedMods] = useState<Record<string, Mod[]>>({});

  const modConvert = useCallback(async (mod: EPMod, epMods: EPMod[], minecraftVersion: string): Promise<Mod> => {
    const link = mod.download_link;
    let len = 0;

    if (link) {
      try {
        const head = await fetch(link, { method: "HEAD" });
        len = head.ok ? parseInt(head.headers.get("Content-Length") || "0", 10) : 0;
      } catch (err) {
        console.warn(err);
      }
    }

    let deps: Mod[] | null = null;
    if (mod.dependencies.length) {
      const promises = mod.dependencies.map(id => {
        const dep = epMods.find(m => m.id === id)!;
        return modConvert(dep, epMods, minecraftVersion);
      });
      deps = await Promise.all(promises);
    }

    return {
      id: mod.id,
      name: mod.name,
      description: mod.description,
      size: len / 1048576,
      icon_url: mod.icon_url,
      site: mod.site_link,
      required: mod.required,
      library: mod.library,
      broken: mod.broken,
      available: !!link,
      reliable_link: link,
      dependencies: deps
    } as Mod;
  }, []);

  const fetchData = useCallback(async (minecraftVersion: string): Promise<Mod[]> => {
    return await fetch(`https://raw.githubusercontent.com/epserv-ru/modpack/refs/heads/meta/mods-${minecraftVersion}.json`)
      .catch(() => { throw new Error("Ошибка загрузки модов с гитхаба") })
      .then(async data => await data.json() as EPMod[])
      .then(async data => await Promise.all(data.map(mod => modConvert(mod, data, minecraftVersion))))
  }, [modConvert]);

  const getModsData = useCallback(async () => {
    const minecraftVersion = window.sessionStorage.getItem("minecraftVersion")!
    const cacheKey = `mods${minecraftVersion}`;
    const timestampKey = `modsTimestamp${minecraftVersion}`;
    const cacheDuration = 60000;

    const cachedMods = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(timestampKey);

    let modsData: Mod[];

    if (cachedMods && cachedTimestamp && Date.now() - parseInt(cachedTimestamp, 10) < cacheDuration) {
      modsData = JSON.parse(cachedMods) as Mod[];
    } else {
      modsData = await fetchData(minecraftVersion);
      localStorage.setItem(cacheKey, JSON.stringify(modsData));
      localStorage.setItem(timestampKey, Date.now().toString());
    }

    setMods(prev => ({...prev, [minecraftVersion]: modsData}));

    const currentChecked = checkedMods[minecraftVersion];
    if (currentChecked.length === 0) {
      setCheckedMods(prev => ({
        ...prev,
        [minecraftVersion]: modsData.filter(mod => mod.required && mod.available)
      }));
    }

    setLoaded(prev => ({...prev, [minecraftVersion]: true}));
  }, [checkedMods, fetchData]);

  return {
    mods,
    loaded,
    checkedMods,
    getModsData,
    setCheckedMods
  };
}