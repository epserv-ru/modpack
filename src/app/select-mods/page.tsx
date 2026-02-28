'use client';

import Logo from "@/components/Logo";
import Navigation from "@/components/Navigation";
import ButtonNext from "@/components/buttons/ButtonNext";
import SkeletonModButton from "@/components/buttons/SkeletonModButton";
import { TextFormatter } from "@/components/TextFormatter";
import { ModsProvider, useModsContext } from "@/components/ModsContext";
import { useEffect, useState } from "react";
import { useIsDataLoaded, useMinecraftVersion } from "@/hooks/useIsDataLoaded";
import { Download, Check } from "flowbite-react-icons/outline";
import { QuestionCircle } from "flowbite-react-icons/solid";
import Mod from "@/types/Mod";
import ModButton from "@/components/buttons/ModButton";
import Tour, { TourStep } from "@/components/Tour";
import WindowControls from "@/components/WindowControls";
import NavigationButtons from "@/components/NavigationButtons";
import { Tooltip } from "@/components/Tooltip";
import { STORAGE_KEYS } from "@/constants/cache";
import { DownloadAppModal } from "@/components/DownloadAppModal";
import { useNavigation } from "@/components/NavigationContext";
import { FilterType } from "@/components/select-mods/FilterDropdown";
import SearchSection from "@/components/select-mods/SearchSection";
import { useModFilters } from "@/hooks/useModFilters";
import { useIsNative } from "@/hooks/useIsNative";

const CSS = {
  main: "flex flex-col h-screen justify-between w-full bg-gray-900 font-[Inter]",
  header: "flex titlebar-drag-region h-12 bg-gray-800 shadow justify-between items-center px-2 select-none z-50",
  headerBrowser: "flex bg-gray-800 shadow justify-between py-3 px-8",
  headerButtons: "flex justify-between gap-8 items-center",
  bodyContainer: "flex justify-center w-full h-full scrollbar scrollbar-thumb-gray-500 scrollbar-track-rounded-lg scrollbar-track-gray-800 overflow-y-scroll bg-transparent",
  bodyInner: "flex flex-col gap-8 rounded-lg py-8 w-[1154px] items-start",
  footer: "flex w-full justify-center bg-gray-700",
  footerInner: "inline-flex w-7xl items-center justify-end gap-8 py-3 px-8",
};

export default function Page() {
  return <ModsProvider><SelectMods/></ModsProvider>;
}

function SelectMods() {
  const modsContext = useModsContext();
  const minecraftVersion = useMinecraftVersion();
  const isLoading = useIsDataLoaded(minecraftVersion);
  const [showTour, setShowTour] = useState(false);
  const [showDownloadAppModal, setShowDownloadAppModal] = useState(false);
  const isNative = useIsNative();
  const { setCanGoBack } = useNavigation();

  useEffect(() => {
    if (minecraftVersion && !modsContext.loaded[minecraftVersion]) modsContext.getModsData();
  }, [minecraftVersion, modsContext]);

  useEffect(() => {
    setCanGoBack(true);
  }, [setCanGoBack]);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem(STORAGE_KEYS.SELECT_MODS_TOUR_SEEN);
    if (!hasSeenTour) {
      const timer = setTimeout(() => { setShowTour(true); }, 1000);
      return () => { clearTimeout(timer); };
    }
  }, []);

  const handleTourComplete = () => {
    setShowTour(false);
    localStorage.setItem(STORAGE_KEYS.SELECT_MODS_TOUR_SEEN, 'true');
  };

  const handleTourSkip = () => {
    setShowTour(false);
    localStorage.setItem(STORAGE_KEYS.SELECT_MODS_TOUR_SEEN, 'true');
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
      content: 'Здесь вы можете выбрать моды для вашей сборки.',
      position: 'right'
    },
    {
      target: '#mods-search',
      title: 'Поиск модов',
      content: 'Используйте строку поиска для быстрого нахождения нужных модов по названию или описанию.',
      position: 'bottom'
    },
    {
      target: '#mods-filter',
      title: 'Фильтры',
      content: 'Фильтруйте моды по категориям: библиотеки, обязательные, рекомендуемые и другие. Это поможет вам найти именно то, что нужно.',
      position: 'bottom'
    },
    {
      target: '#mods-select-all',
      title: 'Выбрать все',
      content: 'Нажмите "Выбрать все", чтобы добавить все моды из текущего фильтра в вашу сборку за один клик.',
      position: 'bottom'
    },
    {
      target: '#mods-list',
      title: 'Список модов',
      content: 'Нажмите на любой мод, чтобы добавить или убрать его из сборки. Библиотеки добавляются автоматически. Обязательные моды нельзя отключить.',
      position: 'top'
    },
    {
      target: '#mods-footer',
      title: 'Ваша сборка',
      content: 'Здесь вы видите количество выбранных модов и их общий размер. Когда будете готовы, нажмите кнопку "Продолжить" для скачивания.',
      position: 'top'
    },
  ];

  return (
    <main className={CSS.main}>
      <Header isNative={isNative} onOpenDownloadApp={() => setShowDownloadAppModal(true)} isTourActive={showTour}/>
      {isLoading ? <SkeletonBody/> : <Body/>}
      {isLoading ? <SkeletonFooter/> : <Footer/>}
      {showTour && !isLoading && (
        <Tour steps={tourSteps} onComplete={handleTourComplete} onSkip={handleTourSkip} />
      )}
      <DownloadAppModal isOpen={showDownloadAppModal} onClose={() => setShowDownloadAppModal(false)} />
    </main>
  );
}

function Header({ isNative, onOpenDownloadApp, isTourActive } : { isNative: boolean; onOpenDownloadApp: () => void; isTourActive: boolean }) {
  return isNative ? <ElectronHeader isTourActive={isTourActive} /> : <BrowserHeader onOpenDownloadApp={onOpenDownloadApp} />;
}

function TourButton({ isTourActive }: { isTourActive: boolean }) {
  const startTour = () => {
    const scrollContainer = document.querySelector('[class*="scrollbar"]');

    if (scrollContainer && scrollContainer.scrollTop > 0) {
      const startPosition = scrollContainer.scrollTop;
      const duration = 400;
      const startTime = performance.now();

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOut = 1 - Math.pow(1 - progress, 3);
        scrollContainer.scrollTop = startPosition * (1 - easeOut);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          window.dispatchEvent(new CustomEvent('startTour'));
        }
      };

      requestAnimationFrame(animateScroll);
    } else {
      window.dispatchEvent(new CustomEvent('startTour'));
    }
  };

  const buttonContent = (
    <button onClick={startTour} disabled={isTourActive} className="p-1">
      <QuestionCircle
        size={24}
        className={`transition-all duration-200 ${isTourActive ? 'text-gray-600' : 'text-gray-400 hover:text-blue-400 cursor-pointer'}`}
      />
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

function ElectronHeader({ isTourActive }: { isTourActive: boolean }) {
  return (
    <header className={CSS.header}>
      <NavigationButtons />

      <div className="flex items-center gap-8">
        <Logo />
        <Navigation />
      </div>

      <div className="titlebar-no-drag flex items-center gap-2">
        <TourButton isTourActive={isTourActive} />
        <WindowControls />
      </div>
    </header>
  );
}

function BrowserHeader({ onOpenDownloadApp }: { onOpenDownloadApp: () => void }) {
  const startTour = () => {
    const scrollContainer = document.querySelector('[class*="scrollbar"]');

    if (scrollContainer && scrollContainer.scrollTop > 0) {
      const startPosition = scrollContainer.scrollTop;
      const duration = 400; // мс
      const startTime = performance.now();

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out для плавности в конце
        const easeOut = 1 - Math.pow(1 - progress, 3);
        scrollContainer.scrollTop = startPosition * (1 - easeOut);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          window.dispatchEvent(new CustomEvent('startTour'));
        }
      };

      requestAnimationFrame(animateScroll);
    } else {
      window.dispatchEvent(new CustomEvent('startTour'));
    }
  };

  return (
    <header className={CSS.headerBrowser}>
      <Logo />
      <Navigation />
      <div className={CSS.headerButtons}>
        <button id="button-download-app" onClick={onOpenDownloadApp}
          className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 transition-all cursor-pointer duration-200 bg-primary-700 hover:bg-primary-800"
        >
          <span className="text-sm font-medium text-white">Скачать приложение</span>
          <Download size={20} className="text-white" />
        </button>
        <Tooltip content={
          <div className="bg-gray-700 border rounded-lg border-gray-600 justify-center">
            <span className="text-white text-sm font-semibold m-4">Помощь</span>
          </div>
        } placement="bottom" showArrow={false}>
          <button onClick={startTour}>
            <QuestionCircle size={30} className="transition-all duration-200 text-gray-400 hover:text-blue-400 cursor-pointer" />
          </button>
          </Tooltip>
      </div>
    </header>
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

function Body() {
  const modsContext = useModsContext();
  const minecraftVersion = useMinecraftVersion();

  if (!minecraftVersion || !modsContext.mods[minecraftVersion]) {
    return null;
  }

  const modsOnActualVersion: Mod[] = modsContext.mods[minecraftVersion];
  const checkedModsOnActualVersion: Mod[] = modsContext.checkedMods[minecraftVersion] ?? [];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>(FilterType.ALL);

  const filteredMods = useModFilters(modsOnActualVersion, searchQuery, activeFilter, checkedModsOnActualVersion);

  const selectAllMods = () => {
    const modsToSelect = activeFilter === FilterType.LIBRARY
      ? filteredMods.filter(mod => mod.available)
      : filteredMods.filter(mod => !mod.library && mod.available && !mod.required);

    const checkedSet = new Set(checkedModsOnActualVersion.map(m => m.id));
    const modsMap = new Map(modsOnActualVersion.map(m => [m.id, m]));

    const newChecked = [...checkedModsOnActualVersion];

    modsToSelect.forEach(mod => {
      if (!checkedSet.has(mod.id)) {
        newChecked.push(mod);
        checkedSet.add(mod.id);
        if (mod.dependencies) {
          mod.dependencies.forEach(dep => {
            if (!checkedSet.has(dep.id)) {
              const dependencyMod = modsMap.get(dep.id);
              if (dependencyMod) {
                newChecked.push(dependencyMod);
                checkedSet.add(dep.id);
              }
            }
          });
        }
      }
    });

    modsContext.setCheckedMods(prev => ({
      ...prev,
      [minecraftVersion]: newChecked
    }));
  };

  const resetSelection = () => {
    const modsToReset = filteredMods.filter(mod => !mod.required);

    const resetSet = new Set(modsToReset.map(m => m.id));

    const newChecked = checkedModsOnActualVersion.filter(mod => !resetSet.has(mod.id));

    modsContext.setCheckedMods(prev => ({
      ...prev,
      [minecraftVersion]: newChecked
    }));
  };

  return (
    <div className={CSS.bodyContainer}>
      <div id="mods-page" className={CSS.bodyInner}>
        <BodyDescription />
        <SearchSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          checkedCount={checkedModsOnActualVersion.length}
          filteredCount={filteredMods.length}
          onSelectAll={selectAllMods}
          onReset={resetSelection}
        />
        <ModsList
          filteredMods={filteredMods}
          minecraftVersion={minecraftVersion}
          checkedMods={checkedModsOnActualVersion}
          setCheckedMods={(updater) => {
            modsContext.setCheckedMods(prev => ({
              ...prev,
              [minecraftVersion]: typeof updater === 'function'
                ? updater(prev[minecraftVersion])
                : updater
            }));
          }}
        />
      </div>
    </div>
  );
}

function ModsList({
  filteredMods,
  minecraftVersion,
  checkedMods,
  setCheckedMods,
}: {
  filteredMods: Mod[];
  minecraftVersion: string;
  checkedMods: Mod[];
  setCheckedMods: (updater: Mod[] | ((prev: Mod[]) => Mod[])) => void;
}) {
  return (
    <div id="mods-list" className="flex flex-col gap-4 pb-8 items-center w-full">
      {filteredMods.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          Моды по вашему запросу не найдены
        </div>
      ) : (
        filteredMods.map((mod) => (
          <ModButton
            key={mod.id}
            mod={mod}
            minecraftVersion={minecraftVersion}
            checkedMods={checkedMods}
            setCheckedMods={setCheckedMods}
          />
        ))
      )}
    </div>
  );
}

function SkeletonBody() {
  return (
    <div className={CSS.bodyContainer}>
      <div className={CSS.bodyInner}>
        <BodyDescription />
        <SkeletonSearchSection />
        <SkeletonModsList />
      </div>
    </div>
  );
}

function SkeletonSearchSection() {
  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="w-80 h-10.5 rounded-lg bg-gray-700 animate-pulse" />
      <div className="w-69 h-10.5 rounded-lg bg-gray-700 animate-pulse" />
      <div className="w-33 h-10.5 rounded-lg bg-gray-600 animate-pulse" />
      <div className="w-27 h-10.5 rounded-lg bg-gray-600 animate-pulse" />
      <div className="w-24 h-5 bg-gray-600 rounded-lg animate-pulse" />
    </div>
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
  const minecraftVersion = useMinecraftVersion();

  if (!minecraftVersion || !modsContext.loaded[minecraftVersion]) {
    return null;
  }

  const checkedModsOnThisVersion: Mod[] = modsContext.checkedMods[minecraftVersion] ?? [];

  return (
    <div id="mods-footer" className={CSS.footer}>
      <div className={CSS.footerInner}>
        <ModsStats mods={checkedModsOnThisVersion} />
        <ButtonNext nextPage={"/download-mods"} loaded={true} disabled={false}/>
      </div>
    </div>
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
    <div className={CSS.footer}>
      <div className={CSS.footerInner}>
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
