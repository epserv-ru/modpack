import Mod from "./types/Mod.tsx";
import EPMod from "./types/EPMod.tsx";
import * as React from "react";
import ModsRecord from "./types/records/ModsRecord.tsx";
import LoadedVersionRecord from "./types/records/LoadedVersionRecord.tsx";

export async function GetModsData(
    minecraftVersion: string,
    checkedMods: Mod[],
    setMods: React.Dispatch<React.SetStateAction<ModsRecord>>,
    setLoaded: React.Dispatch<React.SetStateAction<LoadedVersionRecord>>,
    setCheckedMods: React.Dispatch<React.SetStateAction<ModsRecord>>
) {
    const cacheKey = `mods${minecraftVersion}`;
    const timestampKey = `modsTimestamp${minecraftVersion}`;
    const cacheDuration = 60000;

    const cachedMods = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(timestampKey);

    let mods : Mod[]

    if (cachedMods && cachedTimestamp && Date.now() - parseInt(cachedTimestamp, 10) < cacheDuration) {
        mods = JSON.parse(cachedMods);
    } else {
        mods = await fetchData(minecraftVersion)
        localStorage.setItem(cacheKey, JSON.stringify(mods));
        localStorage.setItem(timestampKey, Date.now().toString());
    }

    setMods(prev => ({...prev, [minecraftVersion]: mods}));
    if (checkedMods == null || checkedMods.length === 0) setCheckedMods(prev => ({...prev, [minecraftVersion]: mods.filter(mod => mod.required && mod.available)}))
    setLoaded(prev => ({...prev, [minecraftVersion]: true}));
}

const fetchData = async (minecraftVersion : string):Promise<Mod[]> => {
    const result = await fetch("https://raw.githubusercontent.com/epserv-ru/modpack/refs/heads/meta/mods.json");
    if (!result.ok) throw new Error("Ошибка загрузки модов с гитхаба");
    const epMods: EPMod[] = await result.json();
    const modPromises = epMods.map(mod =>  modConvert(mod, epMods, minecraftVersion));
    return await Promise.all(modPromises) as Mod[];
}

async function modConvert(mod: EPMod, epMods: EPMod[], minecraftVersion: string): Promise<Mod> {
    const link = mod.reliable_links[minecraftVersion];
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
    if (mod.dependencies?.length) {
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
        size: Number(len / 1048576),
        icon_url: mod.icon_url,
        site: mod.site[minecraftVersion],
        required: mod.required,
        library: mod.library,
        broken: mod.broken,
        available: !!link,
        reliable_link: link,
        dependencies: deps
    } as Mod;
}