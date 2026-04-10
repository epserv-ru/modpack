'use client'

import ChooseVersionMenu from "./ChooseVersionMenu";
import Logo from "@/components/Logo";
import ButtonNext from "@/components/buttons/ButtonNext";
import MinecraftVersion from "@/types/MinecraftVersion";
import { useCallback, useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import TitleBar from "@/components/TitleBar";
import { API_ENDPOINTS } from "@/constants/api";
import { useNavigation } from "@/components/NavigationContext";
import { setMinecraftVersion, useMinecraftVersion } from "@/hooks/useIsDataLoaded.ts";
import {parse} from "smol-toml";

/** Состояние загрузки версий */
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

interface State {
  status: LoadingState;
  versions: MinecraftVersion[];
  error: string
}

/**
 * Страница выбора версии Minecraft
 */
export default function Page() {
  const { setCanGoBack } = useNavigation();
  const [state, setState] = useState<State>({status: 'idle', versions: [], error: ""});

  useEffect(() => {
    setCanGoBack(false);
  }, [setCanGoBack]);

  /**
   * Загружает список версий Minecraft из API
   */
  const getMinecraftVersions = useCallback(async () => {
    setState(prev => ({ ...prev, status: 'loading', error: "" }));

    try {
      const result = await fetch(API_ENDPOINTS.MINECRAFT_VERSIONS, { cache: "no-store" });

      if (!result.ok) {
        setState({ status: "error", versions: [], error: `Ошибка сервера: ${result.status} ${result.statusText}` });
        return;
      }

      const data = parse(await result.text()) as { versions: any[] };
      const versions = data.versions.map(MinecraftVersion.from)

      if (versions.length === 0) {
        setState({ status: "error", versions: [], error: "Список версий пуст" });
        return;
      }

      if (!useMinecraftVersion()) setMinecraftVersion(versions[0].version)

      setState({ status: "success", versions, error: "" });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Неизвестная ошибка при загрузке версий";
      setState(prev => ({ ...prev, status: "error", error: errorMessage }));
    }
  }, []);

  useEffect(() => {
    getMinecraftVersions();
  }, [getMinecraftVersions]);

  return (
    <>
      <TitleBar />
      <main className="flex h-screen w-screen items-center justify-center bg-gray-900 font-[Inter]">
        <div className="flex w-min items-start flex-col gap-6 rounded-lg bg-gray-800 p-8 shadow-2xl">
          <Logo />
          <hr className="w-full border-transparent bg-gray-700" />
          <Navigation />
          <span style={{ fontSize: 17 }} className="text-base font-normal text-gray-400">
            Выберите версию Minecraft Java Edition, для которой нужно установить
            моды. Отдаем приоритет рекомендуемой версии — на ней модпак
            стабильнее и&nbsp;имеет больший выбор модов.
          </span>

          <div className="relative flex flex-col gap-2">
            <label className="text-sm font-normal text-white">Версия Minecraft</label>
            {state.status !== "loading" && state.status !== "idle" ?
              <ChooseVersionMenu minecraftVersions={state.versions}/> :
              <span className="w-44 h-11 rounded-lg bg-gray-700 border border-gray-600 animate-pulse"></span>
            }
          </div>

          <ButtonNext
            nextPage="/select-mods"
            loaded={state.status === "success"}
            disabled={state.status !== "success"}
          />
        </div>
      </main>
    </>
  );
}
