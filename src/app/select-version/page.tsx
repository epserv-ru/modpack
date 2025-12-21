'use client'

import ChooseVersionMenu from "./ChooseVersionMenu";
import Logo from "@/components/Logo";
import ButtonNext from "@/components/buttons/ButtonNext";
import MinecraftVersion from "@/types/MinecraftVersion";
import { useCallback, useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import TitleBar from "@/components/TitleBar";
import { STORAGE_KEYS } from "@/constants/cache";
import { API_ENDPOINTS } from "@/constants/api";
import { useNavigation } from "@/components/NavigationContext";

/** Состояние загрузки версий */
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Страница выбора версии Minecraft
 */
export default function Page() {
  const { setCanGoBack } = useNavigation();

  const [state, setState] = useState<{
    status: LoadingState;
    versions: MinecraftVersion[];
    error: string | null;
  }>({
    status: 'idle',
    versions: [],
    error: null
  });

  useEffect(() => {
    setCanGoBack(false);
  }, [setCanGoBack]);

  /**
   * Загружает список версий Minecraft из API
   */
  const getMinecraftVersions = useCallback(async () => {
    setState(prev => ({ ...prev, status: 'loading', error: null }));

    try {
      const result = await fetch(API_ENDPOINTS.MINECRAFT_VERSIONS, { cache: "no-store", });

      if (!result.ok) {
        setState({ status: "error", versions: [], error: `Ошибка сервера: ${result.status} ${result.statusText}`, });
        return;
      }

      const versions: MinecraftVersion[] = await result.json();

      if (versions.length === 0) {
        setState({ status: "error", versions: [], error: "Список версий пуст" });
        return;
      }

      const currentVersion = window.sessionStorage.getItem(STORAGE_KEYS.MINECRAFT_VERSION);
      if (!currentVersion) {
        window.sessionStorage.setItem(STORAGE_KEYS.MINECRAFT_VERSION, versions[0].version);
      }

      setState({ status: "success", versions, error: null });
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
        <div className="flex flex-col w-min gap-6 rounded-lg bg-gray-800 p-8 shadow-2xl">
          <Logo />
          <hr className="border-transparent bg-gray-700" />
          <Navigation />
          <span style={{ fontSize: 17 }} className="text-base font-normal text-gray-400">
            Выберите версию Minecraft Java Edition, для которой нужно установить моды.
            Отдаем приоритет рекомендуемой версии — на ней модпак стабильнее и&nbsp;имеет больший выбор модов.
          </span>

          <ChooseVersionMenu
            minecraftVersions={state.versions}
            isLoading={state.status === 'loading' || state.status === 'idle'}
          />

          <ButtonNext
            nextPage="/select-mods"
            loaded={state.status === 'success'}
            disabled={state.status !== 'success'}
          />
        </div>
      </main>
    </>
  );
}
