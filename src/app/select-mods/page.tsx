'use client';
import Logo from "@/components/Logo.tsx";
import Navigation from "@/components/Navigation.tsx";
import ModButton from "@/components/buttons/ModButton.tsx";
import ButtonNext from "@/components/buttons/ButtonNext.tsx";
import SkeletonModButton from "@/components/buttons/SkeletonModButton.tsx";
import { TextFormatter } from "@/components/TextFormatter.tsx";
import { ModsProvider, useModsContext } from "@/components/ModsContext.tsx";
import { useEffect, useState } from "react";
import { Check, Search } from "flowbite-react-icons/outline";

const CSS = {
  main: "flex flex-col h-screen w-screen items-start bg-gray-900 font-[Inter]",
  header: "flex w-screen justify-center bg-gray-800 shadow",
  headerInner: "inline-flex w-7xl justify-between pt-3 pr-8 pb-3 pl-8",
  bodyContainer: "flex w-screen scrollbar scrollbar-thumb-gray-500 scrollbar-track-rounded-lg scrollbar-track-gray-800 justify-center overflow-y-scroll bg-transparent",
  bodyInner: "flex flex-col gap-8 rounded-lg pr-16 py-8",
  footer: "flex w-screen justify-center bg-gray-700",
  footerInner: "inline-flex w-7xl items-center justify-end gap-8 py-3 px-8",
  controlsContainer: "flex flex-col gap-4 pl-16",
  searchSection: "flex gap-4 items-center",
  searchInput: "px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 w-80 border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors",
  filterSection: "flex gap-2 flex-wrap",
  filterButton: "px-3 py-1 rounded-full text-sm border border-gray-500 text-gray-300 hover:border-blue-500 hover:text-blue-400 transition-colors cursor-pointer",
  filterButtonActive: "px-3 py-1 rounded-full text-sm bg-blue-500 text-white border border-blue-500 cursor-pointer",
};

type FilterType = 'all' | 'library' | 'client' | 'server' | 'selected';

export default function Page() {
  return <ModsProvider><SelectMods/></ModsProvider>;
}

function useMinecraftVersion() {
  return typeof window !== 'undefined' ? window.sessionStorage.getItem("minecraftVersion") : null;
}

function SelectMods() {
  const modsContext = useModsContext();
  const minecraftVersion = useMinecraftVersion();

  useEffect(() => {
    if (minecraftVersion && !modsContext.loaded[minecraftVersion]) modsContext.getModsData();
  }, [minecraftVersion, modsContext]);

  const isLoading = !minecraftVersion || !modsContext.loaded[minecraftVersion];

  return (
    <main className={CSS.main}>
      <Header/>
      {isLoading ? <SkeletonBody/> : <EnhancedBody />}
      {isLoading ? <SkeletonFooter/> : <Footer />}
    </main>
  );
}

function Header() {
  return (
    <header className={CSS.header}>
      <div className={CSS.headerInner}>
        <Logo />
        <Navigation/>
      </div>
    </header>
  );
}

function BodyDescription() {
  return (
    <div className="flex flex-col gap-6 pl-16">
      <span className="text-2xl leading-tight font-bold text-white">
        Пора сформировать сборку
      </span>
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

function EnhancedBody() {
  const modsContext = useModsContext();
  const minecraftVersion = useMinecraftVersion()!;
  const modsOnActualVersion = modsContext.mods[minecraftVersion] || [];
  const checkedModsOnActualVersion = modsContext.checkedMods[minecraftVersion] || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Фильтрация и поиск
  const filteredMods = modsOnActualVersion
    .filter(mod => {
      // Поиск по названию и описанию
      const matchesSearch = searchQuery === '' ||
        mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Фильтрация по типу
      switch (activeFilter) {
        case 'library':
          return matchesSearch && mod.library;
        case 'client':
          return matchesSearch && !mod.library && mod.type === 'client';
        case 'server':
          return matchesSearch && !mod.library && mod.type === 'server';
        case 'selected':
          return matchesSearch && checkedModsOnActualVersion.some(m => m.id === mod.id);
        default:
          return matchesSearch;
      }
    })
    .sort((a, b) => {
      if (a.library !== b.library) return a.library ? 1 : -1;
      return a.name.localeCompare(b.name);
    });

  // Функция выбора всех модов
  const selectAllMods = () => {
    const allNonLibraryMods = filteredMods.filter(mod => !mod.library && mod.available && !mod.required);
    const newChecked = [...checkedModsOnActualVersion];

    allNonLibraryMods.forEach(mod => {
      if (!newChecked.some(m => m.id === mod.id)) {
        newChecked.push(mod);
        // Добавляем зависимости автоматически
        if (mod.dependencies) {
          mod.dependencies.forEach(dep => {
            if (!newChecked.some(m => m.id === dep.id)) {
              const dependencyMod = modsOnActualVersion.find(m => m.id === dep.id);
              if (dependencyMod) {
                newChecked.push(dependencyMod);
              }
            }
          });
        }
      }
    });

    modsContext.setCheckedMods(prev => {
      return {
        ...prev,
        [minecraftVersion]: newChecked
      };
    });
  };

  // Функция сброса выбора
  const resetSelection = () => {
    const requiredMods = modsOnActualVersion.filter(mod => mod.required);
    modsContext.setCheckedMods({ requiredMods });
  };

  return (
    <div className={CSS.bodyContainer}>
      <div className={CSS.bodyInner}>
        <BodyDescription />

        {/* Панель управления */}
        <div className={CSS.controlsContainer}>
          {/* Строка поиска и кнопки управления */}
          <div className={CSS.searchSection}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Поиск модов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={CSS.searchInput}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            {/* Кнопка выбора всех */}
            <button
              onClick={selectAllMods}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors"
            >
              Выбрать все
            </button>

            {/* Кнопка сброса */}
            <button
              onClick={resetSelection}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
            >
              Сбросить
            </button>

            {/* Счетчик найденных модов */}
            <div className="text-gray-400 text-sm">
              Найдено: {filteredMods.length}
            </div>
          </div>

          {/* Фильтры */}
          <div className={CSS.filterSection}>
            <button
              className={activeFilter === 'all' ? CSS.filterButtonActive : CSS.filterButton}
              onClick={() => setActiveFilter('all')}
            >
              Все моды
            </button>
            <button
              className={activeFilter === 'selected' ? CSS.filterButtonActive : CSS.filterButton}
              onClick={() => setActiveFilter('selected')}
            >
              Выбранные ({checkedModsOnActualVersion.length})
            </button>
            <button
              className={activeFilter === 'library' ? CSS.filterButtonActive : CSS.filterButton}
              onClick={() => setActiveFilter('library')}
            >
              Библиотеки
            </button>
            <button
              className={activeFilter === 'client' ? CSS.filterButtonActive : CSS.filterButton}
              onClick={() => setActiveFilter('client')}
            >
              Клиентские
            </button>
            <button
              className={activeFilter === 'server' ? CSS.filterButtonActive : CSS.filterButton}
              onClick={() => setActiveFilter('server')}
            >
              Серверные
            </button>
          </div>
        </div>

        {/* Список модов */}
        <div className="flex flex-col gap-4 pb-8">
          {filteredMods.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {searchQuery ? 'Моды по вашему запросу не найдены' : 'Моды не найдены'}
            </div>
          ) : (
            filteredMods.map((mod) => (
              <ModButton
                key={mod.id}
                mod={mod}
                minecraftVersion={minecraftVersion}
                checkedMods={checkedModsOnActualVersion}
                setCheckedMods={modsContext.setCheckedMods}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonBody() {
  return (
    <div className={CSS.bodyContainer}>
      <div className={CSS.bodyInner}>
        <BodyDescription />
        <div className="flex flex-col gap-4 pb-8">
          {Array.from({ length: 20 }, (_, i) =>  (
            <SkeletonModButton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const modsContext = useModsContext();
  const minecraftVersion = window.sessionStorage.getItem("minecraftVersion")!;
  const checkedModsOnThisVersion = modsContext.checkedMods[minecraftVersion] || [];

  return (
    <div className="flex w-screen justify-center bg-gray-700">
      <div className="inline-flex w-7xl items-center justify-end gap-8 py-3 px-8">
        <div className="flex flex-row gap-2">
          <Check className="text-green-400" />
          <h1 className="text-base font-normal text-gray-200">
            {checkedModsOnThisVersion.length}{" "}
            {TextFormatter(checkedModsOnThisVersion.length, {one: "мод ", few: "мода ", many: "модов "})}
            {TextFormatter(checkedModsOnThisVersion.length, {one: "выбран", few: "выбрано", many: "выбрано"})}:{" "}
            {checkedModsOnThisVersion.reduce((sum, mod) => sum + mod.size, 0).toFixed(2)}{" "}
            МБ
          </h1>
        </div>
        <ButtonNext nextPage={"/download-mods"} loaded={true}/>
      </div>
    </div>
  );
}

function SkeletonFooter() {
  return (
    <div className="flex w-screen justify-center bg-gray-700">
      <div className="inline-flex w-7xl items-center justify-end gap-8 py-3 px-8">
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 bg-gray-500 rounded-full animate-pulse"></div>
          <div className="w-40 h-4 bg-gray-500 rounded animate-pulse"></div>
        </div>
        <ButtonNext nextPage={"/download-mods"} loaded={false}/>
      </div>
    </div>
  );
}