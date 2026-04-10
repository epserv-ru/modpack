'use client';

import Logo from "@/components/Logo";
import Navigation from "@/components/Navigation";
import ButtonNext from "@/components/buttons/ButtonNext";
import SkeletonModButton from "@/components/buttons/SkeletonModButton";
import { TextFormatter } from "@/components/TextFormatter";
import { ModsProvider, useModsContext } from "@/components/ModsContext";
import {RefObject, useEffect, useRef, useState} from "react";
import {setHasSeenTour, useMinecraftVersion, useSeenTour} from "@/hooks/useIsDataLoaded";
import { Download, Check } from "flowbite-react-icons/outline";
import { QuestionCircle } from "flowbite-react-icons/solid";
import Mod from "@/types/Mod";
import Tour, { TourStep } from "@/components/Tour";
import WindowControls from "@/components/WindowControls";
import NavigationButtons from "@/components/NavigationButtons";
import { Tooltip } from "@/components/Tooltip";
import { DownloadAppModal } from "@/components/DownloadAppModal";
import { useNavigation } from "@/components/NavigationContext";
import { FilterType } from "@/components/select-mods/FilterDropdown";
import { Category } from "@/types/EPMod";
import SearchSection from "@/components/select-mods/SearchSection";
import { useModFilters } from "@/hooks/useModFilters";
import { useIsNative } from "@/hooks/useIsNative";
import ModButton from "@/components/buttons/ModButton.tsx";

export default function Page() {
  return <ModsProvider><SelectMods/></ModsProvider>;
}

function SelectMods() {
  const modsContext = useModsContext();
  const minecraftVersion = useMinecraftVersion()!;
  const modsContainerRef = useRef<HTMLDivElement>(null);
  const hasSeenTour = useSeenTour();
  const isLoading = !modsContext.loaded[minecraftVersion];
  const [showTour, setShowTour] = useState(false);
  const [showDownloadAppModal, setShowDownloadAppModal] = useState(false);
  const isNative = useIsNative();
  const { setCanGoBack } = useNavigation();

  useEffect(() => {
    if (isLoading) modsContext.getModsData();
  }, [minecraftVersion, modsContext]);

  useEffect(() => {
    setCanGoBack(true);
  }, [setCanGoBack]);

  useEffect(() => {
    if (hasSeenTour) return
      const timer = setTimeout(() => setShowTour(true), 1000);
      return clearTimeout(timer);
  }, []);

  const handleTourComplete = () => {
    setShowTour(false);
    setHasSeenTour("true")
  };

  useEffect(() => {
    const handleStartTour = () => { setShowTour(true) };
    window.addEventListener('startTour', handleStartTour);
    return () => { window.removeEventListener('startTour', handleStartTour) };
  }, []);

  const tourSteps: TourStep[] = [
    {
      target: '#mods-page',
      title: 'Добро пожаловать!',
      description: 'Здесь вы можете выбрать моды для вашей сборки.',
      position: 'right'
    },
    {
      target: '#mods-search',
      title: 'Поиск модов',
      description: 'Используйте строку поиска для быстрого нахождения нужных модов по названию или описанию. Вы также можете фильтровать моды по тегам, используя символ # перед тегом (например: #adventure, #decoration).',
      position: 'bottom'
    },
    {
      target: '#mods-filter',
      title: 'Фильтры по приоритету',
      description: 'Фильтруйте моды по приоритету: обязательные, рекомендуемые и опциональные. Это поможет вам найти именно то, что нужно.',
      position: 'bottom'
    },
    {
      target: '#mods-categories',
      title: 'Фильтры по категориям',
      description: 'Выбирайте моды по категориям: оптимизация, визуал, утилиты, геймплей и аудио. Можно выбрать несколько категорий одновременно, тогда отобразятся все моды с выбранными категориями.',
      position: 'bottom'
    },
    {
      target: '#mods-select-all',
      title: 'Выбрать все',
      description: 'Нажмите "Выбрать все", чтобы добавить все моды из текущего отфильтрованного списка в вашу сборку за один клик.',
      position: 'bottom'
    },
    {
      target: '#mods-list',
      title: 'Список модов',
      description: 'Нажмите на любой мод, чтобы добавить или убрать его из сборки. Обязательные моды выбраны по умолчанию, но доступны дял отключения вручную, отключайте на свой страх и риск. Библиотеки добавляются автоматически.',
      position: 'top'
    },
    {
      target: '#mods-first-mod',
      title: 'Кнопка мода',
      description: 'Нажмите на иконку info в правом верхнем углу для подробной информации. Стрелочка ниже разворачивает описание.',
      position: 'top'
    },
    {
      target: '#mods-footer',
      title: 'Ваша сборка',
      description: 'Здесь вы видите количество выбранных модов и их общий размер. Когда будете готовы, нажмите кнопку "Продолжить" для скачивания.',
      position: 'top'
    },
  ];

  return (
    <main className="flex flex-col h-screen justify-between w-full bg-gray-900 font-[Inter]">
      {isNative ? <ElectronHeader isTourActive={showTour} modsContainerRef={modsContainerRef} /> : <BrowserHeader modsContainerRef={modsContainerRef} onOpenDownloadApp={() => { setShowDownloadAppModal(true) }} isTourActive={showTour} />}
      {isLoading ? <SkeletonBody /> : <Body modsContainerRef={modsContainerRef} />}
      {isLoading ? <SkeletonFooter /> : <Footer />}
      {showTour && !isLoading && (
        <Tour steps={tourSteps} onComplete={handleTourComplete} />
      )}
      <DownloadAppModal isOpen={showDownloadAppModal} onClose={() => { setShowDownloadAppModal(false) }} />
    </main>
  );
}

function TourButton({ isTourActive, modsContainerRef }: { isTourActive: boolean, modsContainerRef: RefObject<HTMLDivElement | null> }) {
  const startTour = () => {
    const container = modsContainerRef.current;

    if (!container) {
      window.dispatchEvent(new CustomEvent('startTour'));
      return;
    }

    if (container.scrollTop > 0) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
      const checkScroll = () => {
        if (container.scrollTop <= 0) {
          window.dispatchEvent(new CustomEvent('startTour'));
        } else {
          requestAnimationFrame(checkScroll);
        }
      };

      requestAnimationFrame(checkScroll);
    } else {
      window.dispatchEvent(new CustomEvent('startTour'));
    }
  };

  const buttonContent = (
    <button className="p-1" onClick={startTour} disabled={isTourActive}>
      <QuestionCircle size={24} className={`transition-all duration-200 ease-in-out ${isTourActive ? 'text-gray-600' : 'text-gray-400 hover:text-blue-400 cursor-pointer'}`}/>
    </button>
  );

  return (
    <Tooltip
      content={
        <div className="bg-gray-700 border rounded-lg border-gray-600 justify-center">
          <span className="text-white text-sm font-semibold m-4">Помощь</span>
        </div>
      }
      placement="bottom"
      showArrow={false}
    >
      {buttonContent}
    </Tooltip>
  );
}

function ElectronHeader({ isTourActive, modsContainerRef }: { isTourActive: boolean, modsContainerRef: RefObject<HTMLDivElement | null> }) {
  return (
    <header className="flex h-12 px-2 z-50 justify-between items-center titlebar-drag-region bg-gray-800 shadow select-none">
      <NavigationButtons />

      <div className="flex items-center gap-8">
        <Logo />
        <Navigation />
      </div>

      <div className="titlebar-no-drag flex items-center gap-2">
        <TourButton isTourActive={isTourActive} modsContainerRef={modsContainerRef} />
        <WindowControls />
      </div>
    </header>
  );
}

function BrowserHeader({ onOpenDownloadApp, isTourActive, modsContainerRef }: { onOpenDownloadApp: () => void, isTourActive: boolean, modsContainerRef: RefObject<HTMLDivElement | null> }) {
  return (
    <header className="flex w-full px-8 py-3 justify-between shadow bg-gray-800 border-b border-gray-700">
      <Logo />
      <Navigation />
      <div className="flex justify-between gap-8 items-center">
        <button className="flex px-4 py-2.5 justify-center gap-2 items-center rounded-lg transition-all duration-200 ease-in-out bg-primary-700 hover:bg-primary-800 cursor-pointer"
                id="button-download-app"
                onClick={onOpenDownloadApp}
        >
          <span className="text-sm font-medium text-white">Скачать приложение</span>
          <Download size={20} className="text-white" />
        </button>
        <TourButton isTourActive={isTourActive} modsContainerRef={modsContainerRef} />
      </div>
    </header>
  );
}

function Body({modsContainerRef} : {modsContainerRef: RefObject<HTMLDivElement | null>}) {
  const modsContext = useModsContext();
  const minecraftVersion = useMinecraftVersion()!;
  const modsOnActualVersion: Mod[] = modsContext.mods[minecraftVersion];
  const toggledModsOnActualVersion: Mod[] = modsContext.toggledMods[minecraftVersion];
  const toggledModsOnActualVersionWithoutLibraries: Mod[] = toggledModsOnActualVersion.filter(mod => !mod.isLibrary)

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>(FilterType.ALL);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const filteredMods = useModFilters(modsOnActualVersion, searchQuery, activeFilter, toggledModsOnActualVersion, selectedCategories);

  const toggleCategory = (category: Category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const selectAllMods = () => {
    const modsMap = new Map(modsOnActualVersion.map(m => [m.id, m]));
    const resultSet = new Set(toggledModsOnActualVersion.map(m => m.id));

    filteredMods.forEach(mod => {
      if (!mod.isLibrary && mod.isAvailable) {
        resultSet.add(mod.id);
        mod.getAllDependencies().forEach(dep => {
          resultSet.add(dep.id);
        });
      }
    });

    const newToggled = Array.from(resultSet)
      .map(id => modsMap.get(id))
      .filter((mod): mod is Mod => !!mod);

    modsContext.setToggledMods(prev => ({...prev, [minecraftVersion]: newToggled}));
  };

  const resetSelection = () => {
    const modsToReset = filteredMods.filter(mod => !mod.isRequired);
    const resetSet = new Set(modsToReset.map(m => m.id));
    const newToggled = toggledModsOnActualVersion.filter(mod => !resetSet.has(mod.id));

    modsContext.setToggledMods(prev => ({...prev, [minecraftVersion]: newToggled}));
  };

  const modList = (
    <div id="mods-list" className="flex flex-col gap-4 pb-8 items-center w-full">
      {filteredMods.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          Моды по вашему запросу не найдены
        </div>
      ) : (
        filteredMods.map((mod, index) => (
          <div key={index} {...(index === 0 && { id: "mods-first-mod" })}>
            <ModButton
              mod={mod}
              minecraftVersion={minecraftVersion}
              toggledMods={toggledModsOnActualVersion}
              setToggledMods={(updater) => {
                modsContext.setToggledMods(prev => ({
                  ...prev,
                  [minecraftVersion]: typeof updater === 'function'
                    ? updater(prev[minecraftVersion])
                    : updater
                }));
              }}
            />
          </div>
        ))
      )}
    </div>
  )

  return (
    <div ref={modsContainerRef} className="flex w-full h-full justify-center scrollbar scrollbar-thumb-gray-500 scrollbar-track-rounded-lg scrollbar-track-gray-800 overflow-y-scroll bg-transparent">
      <div id="mods-page" className="flex flex-col w-6xl gap-4 py-8 items-start">
        <BodyDescription />
        <SearchSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          toggledCount={toggledModsOnActualVersionWithoutLibraries.length}
          filteredCount={filteredMods.length}
          onSelectAll={selectAllMods}
          onReset={resetSelection}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
        />
        {modList}
      </div>
    </div>
  );
}

function BodyDescription() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <span className="text-2xl leading-tight font-bold text-white">
          Пора сформировать сборку
        </span>
      </div>
      <span className="text-base font-normal text-gray-400">
        Для вашего удобства мы уже выбрали несколько модов, которыми пользуются многие игроки на ElectroPlay.
        <br />
        Вы можете изменить выбор на свой вкус — просто нажмите на любой мод, чтобы добавить или убрать его.
        <br />
        Зависимости к модам выберутся автоматически.
      </span>
    </div>
  );
}

function SkeletonBody() {
  return (
    <div className="flex w-full h-full justify-center scrollbar scrollbar-thumb-gray-500 scrollbar-track-rounded-lg scrollbar-track-gray-800 overflow-y-scroll bg-transparent">
      <div className="flex flex-col w-6xl gap-4 py-8 items-start">
        <BodyDescription />
        <SkeletonSearchSection />
        <SkeletonModsList />
      </div>
    </div>
  );
}

function SkeletonSearchSection() {
  return (
    <>
      <div className="flex flex-row gap-4 items-center">
        <div className="w-107 h-10.5 rounded-lg bg-gray-700 border border-gray-600 animate-pulse" />
        <div className="w-67 h-10.5 rounded-lg bg-gray-700 border border-gray-600 animate-pulse" />
        <div className="w-33 h-10.5 rounded-lg bg-gray-600 animate-pulse" />
        <div className="w-27 h-10.5 rounded-lg bg-gray-600 animate-pulse" />
        <div className="w-24 h-5 bg-gray-600 rounded-lg animate-pulse" />
      </div>
      <div className="flex flex-row gap-2">
        <div className="w-32.5 h-8 rounded-lg bg-gray-700 animate-pulse" />
        <div className="w-[79px] h-8 rounded-lg bg-gray-700 animate-pulse" />
        <div className="w-[91px] h-8 rounded-lg bg-gray-700 animate-pulse" />
        <div className="w-[101px] h-8 rounded-lg bg-gray-700 animate-pulse" />
        <div className="w-[71px] h-8 rounded-lg bg-gray-700 animate-pulse" />
      </div>
    </>
  );
}

function SkeletonModsList() {
  return (
    <div className="flex flex-col gap-4 pb-8">
      {Array.from({ length: 20 }, (_, i) => (
        <SkeletonModButton key={i} />
      ))}
    </div>
  );
}

function Footer() {
  const modsContext = useModsContext();
  const minecraftVersion = useMinecraftVersion()!;

  const toggledModsOnThisVersion: Mod[] = modsContext.toggledMods[minecraftVersion] ?? [];

  return (
    <footer id="mods-footer" className="flex w-full justify-center bg-gray-700 border-t border-gray-600">
      <div className="inline-flex w-7xl px-8 py-3 gap-8 items-center justify-end">
        <ModsStats mods={toggledModsOnThisVersion} />
        <ButtonNext nextPage={"/download-mods"} loaded={true} disabled={false}/>
      </div>
    </footer>
  );
}

function ModsStats({ mods }: { mods: Mod[] }) {
  const totalSize = mods.reduce((sum, mod) => sum + mod.size, 0).toFixed(2);

  return (
    <div className="flex flex-row gap-2">
      <Check className="text-green-400" />
      <h1 className="text-base font-normal text-gray-200">
        {mods.length}{" "}
        {TextFormatter(mods.length, {one: "мод ", few: "мода ", many: "модов "})}
        {TextFormatter(mods.length, {one: "выбран", few: "выбрано", many: "выбрано"})}:{" "}
        {totalSize} МБ
      </h1>
    </div>
  );
}

function SkeletonFooter() {
  return (
    <div className="flex w-full justify-center bg-gray-700 border-t border-gray-600">
      <div className="inline-flex w-7xl px-8 py-3 gap-8 items-center justify-end">
        <SkeletonModsStats />
        <ButtonNext nextPage={"/download-mods"} loaded={false} disabled={true}/>
      </div>
    </div>
  );
}

function SkeletonModsStats() {
  return (
    <div className="flex flex-row gap-2">
      <div className="w-4 h-4 bg-gray-500 rounded-full animate-pulse"></div>
      <div className="w-40 h-4 bg-gray-500 rounded animate-pulse"></div>
    </div>
  );
}
