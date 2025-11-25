'use client'
import ChooseVersionMenu from "./ChooseVersionMenu.tsx";
import Logo from "@/components/Logo.tsx";
import ButtonNext from "@/components/buttons/ButtonNext.tsx";
import MinecraftVersion from "@/types/MinecraftVersion.tsx";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation.tsx";
import SkeletonChooseVersionMenu from "./SkeletonChooseVersionMenu.tsx";

export default function Page() {
  const [loaded, setLoaded] = useState(false)
  const [versions, setVersions] = useState<MinecraftVersion[]>([])

  useEffect(() => {
   async function getMinecraftVersions() {
     const result = await fetch("https://raw.githubusercontent.com/epserv-ru/modpack/refs/heads/meta/minecraft_versions.json");
     const versions: MinecraftVersion[] = await result.json();
     if (versions && versions.length > 0) {
       const currentVersion = window.sessionStorage.getItem("minecraftVersion");
       if (!currentVersion) {
         window.sessionStorage.setItem("minecraftVersion", versions[0].version);
       }
       setVersions(versions)
       setLoaded(true);
     }
   }

   getMinecraftVersions()
  }, []);

   return <main className="flex h-screen w-screen items-center justify-center bg-gray-900 font-[Inter]">
    <div className="flex flex-col w-min gap-6 rounded-lg bg-gray-800 p-8 shadow-2xl">
       <Logo />
       <hr className="border-transparent bg-gray-700" />
       <Navigation />
       <span style={{ fontSize: 17 }} className="text-base font-normal text-gray-400">
         Выберите версию Minecraft Java Edition, для которой нужно установить моды.
         Отдаем приоритет рекомендуемой версии — на ней модпак стабильнее и&nbsp;имеет больший выбор модов.
      </span>
      { versions.length == 0
        ? <SkeletonChooseVersionMenu />
        : <ChooseVersionMenu minecraftVersions={versions}/>
      }
      <ButtonNext nextPage={"/select-mods"} loaded={loaded}/>
     </div>
    </main>
}