import Mod from "@/types/Mod.tsx";
import {ArrowUpRightFromSquare, Download, InfoCircle} from "flowbite-react-icons/solid";
import {ArrowDown, ArrowUp, ChevronDown, Close} from "flowbite-react-icons/outline";
import {useEffect, useMemo, useRef, useState} from "react";
import {Tooltip} from "@/components/Tooltip.tsx";
import * as React from "react";

interface ModButtonProps {
  mod: Mod;
  minecraftVersion: string;
  toggledMods: Mod[];
  setToggledMods: (updater: Mod[] | ((prev: Mod[]) => Mod[])) => void;
}

function ModButtonComponent({ mod, minecraftVersion, toggledMods, setToggledMods } : ModButtonProps) {

  const [showInfo, setShowInfo] = useState(false);
  const showInfoRef = useRef(showInfo);
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(17);
  const textRef = useRef<HTMLDivElement>(null);
  const mods = useMemo(() => new Set(toggledMods.map(m => m.id)), [toggledMods]);
  const isToggled = mods.has(mod.id);

  const toggle = () => setToggledMods(prev => {
      const isCurrentlyToggled = prev.some(m => m.id === mod.id);
      return updateModsList(prev, mod, !isCurrentlyToggled);
    });

  useEffect(() => {
    if (textRef.current) {
      setContentHeight(textRef.current.scrollHeight);
    }
  }, [mod.description, isExpanded]);

  useEffect(() => {
    showInfoRef.current = showInfo;
  }, [showInfo]);

  useEffect(() => {
    const handleStartTour = () => {
      if (showInfoRef.current) setShowInfo(false);
    };
    window.addEventListener("startTour", handleStartTour);
    return () => window.removeEventListener("startTour", handleStartTour);
  });

  const icon = (
      <img src={mod.links.icon} className="h-24 w-24 rounded-lg ring-1 ring-inset ring-gray-600/40 object-cover bg-gray-700/40" alt="Лого" />
  )

  const title = (
    <div className="flex items-center gap-2">
      <h1 className="text-xl leading-tight font-semibold text-white">{mod.name}</h1>

      {mod.size !== 0 && (
        <h1 className="text-base leading-none font-normal text-gray-400">{mod.formattedSize}</h1>
      )}

      <span className={`rounded-lg px-3 py-1 text-sm text-white ${mod.priorityColor}`}>{mod.priorityDisplayName}</span>
    </div>
  );

  const description = (
    <div className="flex overflow-hidden transition-all duration-300 ease-in-out" style={{ height: isExpanded ? `${contentHeight}px` : "17px" }}>
      <span ref={textRef} className="text-base leading-none font-normal text-gray-400">{mod.description}</span>
    </div>
  )

  const tags = (
    <div className="flex gap-3 mt-2">
      {mod.categorization.tags.map((tag) => (
        <span key={tag} className="px-2 py-0.5 text-[0.825rem] text-white bg-white/10 rounded capitalize border border-white/5">{tag}</span>
      ))}
    </div>
  )

  const buttonInfo = (
    <button className="transition-colors text-gray-400 hover:text-blue-400 cursor-pointer"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              setShowInfo(true);
            }}>
      <InfoCircle size={24} />
    </button>
  )

  const buttonExpand= (
    <button className="transition-colors text-gray-400 hover:text-blue-400 cursor-pointer"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}>

      <ChevronDown size={26} className={`transition-transform duration-200 ease-in-out ${isExpanded ? "rotate-180" : ""}`} />
    </button>
  )

  const cardStyles = useMemo(() => {
    if (!mod.isAvailable) return "bg-red-900/50 border-red-800/50 hover:bg-red-900/50 hover:border-red-800/50 hover:shadow-red-800/20";
    if (mod.isBroken) return isToggled ? "bg-yellow-400/40 border-yellow-300/40 cursor-pointer" : "bg-yellow-500/40 border-yellow-400/40 hover:bg-yellow-400/40 hover:border-yellow-300/40 hover:shadow-yellow-300/20 cursor-pointer";
    if (isToggled) return "bg-green-900 border-green-700 hover:shadow-green-700/20 cursor-pointer";

    return "bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600 cursor-pointer";
  }, [mod.isAvailable, mod.isBroken, isToggled]);

  const modCard = (
    <label htmlFor={mod.id} className={`flex min-h-34 w-6xl p-4 rounded-lg border ${cardStyles} transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20`}>
      <input type="checkbox" className="hidden" id={mod.id} checked={mod.isRequired || isToggled} disabled={!mod.isAvailable} onChange={toggle} />
      <div className="flex w-full gap-6 items-center">
        {icon}
        <div className="grid grid-cols-[1fr_auto] h-full w-full items-center">
          <div className="flex flex-col h-full items-start justify-start gap-3">
            {title}
            {description}
            {tags}
          </div>
          <div className="flex flex-col h-full items-start gap-3">
            {buttonInfo}
            {contentHeight > 18 && buttonExpand}
          </div>
        </div>
      </div>
    </label>
  );

  function TooltipContent() {
    return (
      <div className={`flex flex-col ${mod.isBroken ? `w-58` : ``} gap-1.5 p-2.5 pr-3 pb-2.5 pl-3`}>
        <span className="text-center text-sm leading-none font-medium text-white">{mod.isBroken ? "Этот мод имеет баги" : "Этот мод нельзя добавить"}</span>
        <span className="text-xs leading-tight font-normal whitespace-normal text-gray-400">
          {mod.isBroken
            ? `${mod.name} работает, но создает некоторые баги — добавляйте на свой страх и риск`
            : `${mod.name} еще не вышел на версию ${minecraftVersion}`}
        </span>
      </div>
    )
  }

  return (
    <>
      {mod.isBroken || !mod.isAvailable ?
          <Tooltip content={<TooltipContent />} placement="left" className="bg-gray-800 shadow-md">
            {modCard}
          </Tooltip>
         : modCard
      }
      <EnhancedModPreviewModal
        mod={mod}
        isOpen={showInfo}
        onClose={() => {setShowInfo(false)}}
        isToggled={isToggled}
        onToggle={toggle}
      />
    </>
  );
}

function addModWithDependencies(map: Map<string, Mod>, modToAdd: Mod, visited = new Set<string>()): void {
  if (visited.has(modToAdd.id)) return
  visited.add(modToAdd.id);

  if (!map.has(modToAdd.id)) {
    map.set(modToAdd.id, modToAdd);
    modToAdd.getAllDependencies()?.forEach(dep => addModWithDependencies(map, dep, visited));
  }
}

function isDependencyNeeded(depId: string, mods: Mod[]): boolean {
  return mods.some(mod => mod.dependencies?.some(dep => dep.id === depId))
}

function removeModWithDependencies(map: Map<string, Mod>, modToRemove: Mod): void {
  map.delete(modToRemove.id);

  modToRemove.getAllDependencies().forEach(dep => {
    const remainingMods = Array.from(map.values())
    if (!isDependencyNeeded(dep.id, remainingMods)) {
      map.delete(dep.id);
    }
  });
}

function updateModsList(currentList: Mod[], mod: Mod, shouldAdd: boolean,): Mod[] {
  const map = new Map<string, Mod>(currentList.map(m => [m.id, m]));

  if (shouldAdd) {
    addModWithDependencies(map, mod);
  } else {
    removeModWithDependencies(map, mod);
  }

  return Array.from(map.values())
}

const arePropsEqual = (prevProps: ModButtonProps, nextProps: ModButtonProps) => {
  return (
    prevProps.mod.id === nextProps.mod.id &&
    prevProps.mod.name === nextProps.mod.name &&
    prevProps.mod.isAvailable === nextProps.mod.isAvailable &&
    prevProps.toggledMods.length === nextProps.toggledMods.length &&
    prevProps.toggledMods.every((m) =>
      nextProps.toggledMods.some((nm) => nm.id === m.id),
    )
  );
}

interface EnhancedModPreviewModalProps {
  mod: Mod;
  isOpen: boolean;
  onClose: () => void;
  isToggled: boolean;
  onToggle: () => void;
}

function EnhancedModPreviewModal({mod, isOpen, onClose, isToggled, onToggle}: EnhancedModPreviewModalProps) {
  if (!isOpen) return null;

  const downloadUrl = mod.links.download || mod.links.site;

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const icon = (
    <img src={mod.links.icon} className="h-16 w-16 rounded-lg" alt="Лого мода"/>
  )

  const title = (
    <div className="flex flex-col items-start">
      <h3 className="text-xl font-bold text-white">{mod.name}</h3>
      <span className={mod.statusColor} >{mod.statusDisplayName}</span>
    </div>
  )

  const header = (
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-4">
        {icon}
        {title}
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-white text-xl transition-all duration-200 ease-in-out cursor-pointer">
        <Close />
      </button>
    </div>
  )

  const techData = (
    <div className="flex flex-col rounded-lg gap-2 p-4 bg-gray-700">

      <h4 className="text-lg font-semibold text-white">Технические данные</h4>

      <div className="flex justify-between">
        <span className="text-gray-400">ID мода:</span>
        <span className="text-sm text-white">{mod.id}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-400">Категория:</span>
        <span className="text-white">{mod.categoryDisplayName}</span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-400">Размер:</span>
        <span className="text-white">{mod.formattedSize}</span>
      </div>

    </div>
  )

  const deps = (
    <div className="flex flex-col rounded-lg gap-2 p-4 bg-gray-700">
      <h4 className="text-lg font-semibold text-white">Зависимости</h4>
      {mod.hasDependencies ? (
        <div className="flex flex-col gap-2">
          {mod.dependencies.map(dep => (
            <div key={dep.id} className="flex p-2 rounded items-center justify-between bg-gray-600">
              <span className="text-white text-sm">{dep.name}</span>
              <span className="text-white text-xs">{dep.formattedSize || "0.00 МБ"}</span>
            </div>
          ))}
          <p className="text-white text-xs">
            * Зависимости добавляются автоматически при выборе мода
          </p>
        </div>
      ) : (
        <p className="items-center text-gray-400">Нет зависимостей</p>
      )}
    </div>
  )

  const warn = (
    <div className="flex flex-col gap-2 p-4 rounded-lg bg-gray-700">
      <h4 className="text-lg text-red-400 font-semibold">Внимание!</h4>
      <p className="text-sm text-white">Этот мод может вызывать ошибки или нестабильную работу игры</p>
    </div>
  )

  const footer = (
    <div className="flex justify-end gap-4">
      {mod.isAvailable && (
        <>
          <button
            className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-sm font-medium text-white transition-colors cursor-pointer ${
              isToggled ? "bg-red-600 text-white hover:bg-red-600/70" : "bg-green-600 text-white hover:bg-green-700"
            }`}
            onClick={handleToggleClick}>
            {isToggled ? "Убрать из сборки" : "Добавить в сборку"}
            {isToggled ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
          </button>

          <a
            className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700"
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => {
              e.stopPropagation();
            }}>
            Скачать отдельно
            <Download size={16} />
          </a>
        </>
      )}
      <a
        className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm font-medium text-white transition-colors bg-gray-600 hover:bg-gray-700"
        href={mod.links.site}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => {
          e.stopPropagation();
        }}>
        Страница мода
        <ArrowUpRightFromSquare size={16} />
      </a>
    </div>
  )

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 bg-black/75 backdrop-blur-[2px]" onClick={handleOverlayClick}>
      <div className="flex flex-col w-2xl p-6 gap-4 rounded-lg bg-gray-800">
        {header}
        <div className="grid grid-cols-2 gap-4">
          {techData}
          {deps}
        </div>
        {mod.isBroken && warn}
        {footer}
      </div>
    </div>
  );
}

export default React.memo(ModButtonComponent, arePropsEqual);