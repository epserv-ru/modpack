import { ArrowUpRightFromSquare, Download, InfoCircle } from "flowbite-react-icons/solid";
import Mod from "../../types/Mod";
import * as React from "react";
import { Tooltip } from "../Tooltip";
import { useMemo, useState, useEffect, useRef } from "react";
import { ArrowDown, ArrowUp, Check, Close } from "flowbite-react-icons/outline";
import { isValidUrl } from "@/utils/urlValidation";

const CSS = {
  iconContainer: "flex w-16 h-8 items-center justify-center",
  checkbox: "peer hidden",
  modLabel: "flex h-32 w-288 cursor-pointer flex-row gap-8 rounded-lg border border-gray-700 hover:border-gray-600 hover:bg-gray-700 bg-gray-800 p-4 shadow transition-all duration-100 ease-out",
  labelBroken: "opacity-50 bg-yellow-300 hover:bg-yellow-300 border-yellow-200 hover:yellow-200",
  labelDisabled: "opacity-50 bg-red-900 hover:bg-red-900 border-red-800 hover:border-red-800",
  labelChecked: "peer-checked:border-green-700 peer-checked:bg-green-900 hover:bg-green-900 hover:border-green-700",
  modIcon: "h-24 w-24 rounded-lg",
  contentContainer: "flex flex-col gap-3 flex-1",
  titleRow: "flex flex-row items-center justify-between",
  titleSection: "flex flex-row items-center gap-2",
  modTitle: "text-xl leading-tight font-semibold text-white",
  modSize: "text-base leading-none font-normal text-gray-400",

  badge: "px-3 py-1 text-white text-sm rounded-full",
  badgeRequired: "bg-blue-500",
  badgeRecommended: "bg-green-500",
  badgeLibrary: "bg-purple-500",

  previewButton: "transition-colors text-gray-400 hover:text-blue-400 cursor-pointer",
  description: "text-base leading-none font-normal text-gray-400",
  modalOverlay: "fixed inset-0 bg-black/75 backdrop-blur-[2px] flex items-center justify-center z-40",
  modalContainer: "bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto",
  modalHeader: "flex justify-between items-start mb-6",
  modalTitleSection: "flex items-center gap-4",
  modalIcon: "h-16 w-16 rounded-lg",
  modalTitle: "text-xl font-bold text-white",
  modalVersion: "text-gray-400 text-sm",
  modalCloseButton: "text-gray-400 hover:text-white text-xl cursor-pointer",
  statusSection: "flex flex-row justify-around gap-4 p-4 bg-gray-700 rounded-lg",
  sectionTitle: "text-sm font-semibold text-gray-300 mb-2",
  statusIndicator: "flex items-center gap-2",
  toggleButton: "px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer",
  toggleDisabled: "bg-gray-600 text-gray-400 cursor-not-allowed",
  toggleChecked: "bg-red-600 hover:bg-red-700 text-white",
  toggleUnchecked: "bg-green-600 hover:bg-green-700 text-white",
  techGrid: "grid grid-cols-2 gap-4",
  techSection: "space-y-2 bg-gray-700 rounded-lg p-4",
  techTitle: "text-lg font-semibold text-white",
  techItem: "flex justify-between",
  techLabel: "text-gray-400",
  techValue: "text-white",
  modId: "font-mono text-sm",
  depItem: "flex items-center justify-between p-2 bg-gray-600 rounded",
  depName: "text-white text-sm",
  depSize: "text-white text-xs",
  depNote: "text-white text-xs",
  warningContainer: "p-4 rounded-lg bg-gray-700",
  warningTitle: "text-lg text-red-400 font-semibold mb-2",
  warningText: "text-sm text-white",
  modalFooter: "flex justify-end items-center border-gray-700 gap-3",
  footerStatus: "text-sm text-gray-400",
  statusSelected: "text-green-400",
  addButton: "px-2.5 py-2 rounded-lg text-sm text-white font-medium transition-colors flex items-center cursor-pointer gap-2",
  downloadButton: "px-2.5 py-2 rounded-lg text-sm text-white font-medium transition-colors flex items-center gap-2",
  downloadPrimary: "bg-blue-600 hover:bg-blue-700",
  downloadSecondary: "bg-gray-600 hover:bg-gray-700",
};

/**
 * Рекурсивно добавляет мод с зависимостями
 * Защищён от циклических зависимостей через visited
 * @param map - Карта модов
 * @param modToAdd - Мод для добавления
 * @param visited - Множество посещённых модов
 */
function addModWithDependencies(
  map: Map<string, Mod>,
  modToAdd: Mod,
  visited = new Set<string>()
): void {
  if (visited.has(modToAdd.id)) {
    return;
  }
  visited.add(modToAdd.id);

  if (!map.has(modToAdd.id)) {
    map.set(modToAdd.id, modToAdd);
    modToAdd.dependencies?.forEach(dep => {
      addModWithDependencies(map, dep, visited);
    });
  }
}

/**
 * Проверяет, нужна ли зависимость другим модам
 * @param depId - ID зависимости
 * @param mods - Список модов для проверки
 * @returns true если зависимость нужна
 */
function isDependencyNeeded(depId: string, mods: Mod[]): boolean {
  return mods.some(mod =>
    mod.dependencies?.some(dep => dep.id === depId)
  );
}

/**
 * Удаляет мод и ненужные зависимости
 * @param map - Карта модов
 * @param modToRemove - Мод для удаления
 */
function removeModWithDependencies(
  map: Map<string, Mod>,
  modToRemove: Mod
): void {
  map.delete(modToRemove.id);

  (modToRemove.dependencies || []).forEach(dep => {
    const remainingMods = Array.from(map.values());
    if (!isDependencyNeeded(dep.id, remainingMods)) {
      map.delete(dep.id);
    }
  });
}

/**
 * Обновляет список модов при добавлении/удалении
 * @param currentList - Текущий список модов
 * @param mod - Мод для добавления/удаления
 * @param shouldAdd - true для добавления, false для удаления
 * @returns Обновлённый список модов
 */
function updateModsList(currentList: Mod[], mod: Mod, shouldAdd: boolean): Mod[] {
  const map = new Map<string, Mod>(currentList.map(m => [m.id, m]));

  if (shouldAdd) {
    addModWithDependencies(map, mod);
  } else {
    removeModWithDependencies(map, mod);
  }

  return Array.from(map.values());
}

/** Пропсы компонента кнопки мода */
interface ModButtonProps {
  /** Мод для отображения */
  mod: Mod;
  /** Версия Minecraft */
  minecraftVersion: string;
  /** Список выбранных модов */
  checkedMods: Mod[];
  /** Сеттер для обновления списка выбранных модов */
  setCheckedMods: (updater: Mod[] | ((prev: Mod[]) => Mod[])) => void;
}

/**
 * Компонент кнопки выбора мода
 */
function ModButtonComponent({
  mod,
  minecraftVersion,
  checkedMods,
  setCheckedMods
}: ModButtonProps) {
  const [showPreview, setShowPreview] = useState(false);
  const showPreviewRef = useRef(showPreview);

  useEffect(() => {
    showPreviewRef.current = showPreview;
  }, [showPreview]);

  useEffect(() => {
    const handleStartTour = () => {
      if (showPreviewRef.current) {
        setShowPreview(false);
      }
    };
    window.addEventListener('startTour', handleStartTour);
    return () => window.removeEventListener('startTour', handleStartTour);
  }, []);

  const modsSet = useMemo(() => new Set(checkedMods.map(m => m.id)), [checkedMods]);
  const isChecked = modsSet.has(mod.id);

  const isRequired = mod.required;
  const isAvailable = mod.available;

  const toggleMod = () => {
    setCheckedMods(prev => {
      const isCurrentlyChecked = prev.some(m => m.id === mod.id);
      return updateModsList(prev, mod, !isCurrentlyChecked);
    });
  };

  const labelContent = (
    <>
      <img src={mod.icon_url} className={CSS.modIcon} alt="Лого мода"/>
      <div className={CSS.contentContainer}>
        <div className={CSS.titleRow}>
          <div className={CSS.titleSection}>
            <h1 className={CSS.modTitle}>
              {mod.name}
            </h1>
              { mod.size != 0 && (
                <h1 className={CSS.modSize}>
                  {mod.size.toFixed(2)} МБ
                </h1>
                ) }
            {mod.required && (
              <span className={`${CSS.badge} ${CSS.badgeRequired}`}>
                Обязательный
              </span>
            )}
            {!mod.required && mod.recommended && (
              <span className={`${CSS.badge} ${CSS.badgeRecommended}`}>
                Рекомендуемый
              </span>
            )}
            {!mod.required && !mod.recommended && mod.library && (
              <span className={`${CSS.badge} ${CSS.badgeLibrary}`}>
                Библиотека
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowPreview(true);
            }}
            className={CSS.previewButton}
          >
            <InfoCircle className="w-6 h-6" />
          </button>
        </div>
        <div className={CSS.description}>
          {mod.description}
        </div>
      </div>
    </>
  );

  return (
    <>
      <input
        type="checkbox"
        id={mod.id}
        className={CSS.checkbox}
        checked={isRequired || isChecked}
        disabled={isRequired || !isAvailable}
        onChange={toggleMod}
        />
      {(mod.broken || !mod.available) ? (
        <Tooltip content={<TooltipContent mod={mod} minecraftVersion={minecraftVersion} />} placement="left" className="bg-gray-800 shadow-md">
          <label htmlFor={mod.id} className={`${CSS.modLabel} ${CSS.labelDisabled}`}>
            {labelContent}
          </label>
        </Tooltip>
      ) : (
          <label htmlFor={mod.id} className={`${CSS.modLabel} ${mod.required || isChecked ? CSS.labelChecked : ''}`}>
            {labelContent}
          </label>
      )}

      <EnhancedModPreviewModal
        mod={mod}
        isOpen={showPreview}
        onClose={() => {
          setShowPreview(false);
        }}
        minecraftVersion={minecraftVersion}
        isChecked={isChecked}
        isRequired={isRequired}
        onToggle={toggleMod}
      />
    </>
  );
}

function TooltipContent(
  { mod, minecraftVersion } :
  { mod : Mod, minecraftVersion : string }
) {
  return (
    <div className={`flex flex-col ${mod.broken ? `w-58` : ``} p-2.5 pb-2.5 pr-3 pl-3 gap-1.5`}>
      <span className="leading-none text-sm font-medium text-white text-center">
        {mod.broken ? "Этот мод имеет баги" : "Этот мод установить нельзя"}
      </span>
      <span className="leading-tight text-xs font-normal text-gray-400 whitespace-normal">
        {mod.broken ? `${mod.name} работает, но создает некоторые баги — устанавливайте на свой страх и риск` : `${mod.name} еще не вышел на версию ${minecraftVersion}`}
      </span>
    </div>
  )
}

interface EnhancedModPreviewModalProps {
  mod: Mod,
  isOpen: boolean,
  onClose: () => void,
  minecraftVersion: string,
  isChecked: boolean,
  isRequired: boolean,
  onToggle: () => void
}

function EnhancedModPreviewModal(
  { mod, isOpen, onClose, minecraftVersion, isChecked, isRequired, onToggle}: EnhancedModPreviewModalProps) {

  if (!isOpen) return null;

  const downloadUrl = mod.reliable_link || mod.site;

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={CSS.modalOverlay} onClick={handleOverlayClick}>
      <div className={CSS.modalContainer} onClick={handleContainerClick}>
        <div className={CSS.modalHeader}>
          <div className={CSS.modalTitleSection}>
            <img src={mod.icon_url} className={CSS.modalIcon} alt="Лого мода"/>
            <div>
              <h3 className={CSS.modalTitle}>{mod.name}</h3>
              <div className={CSS.statusIndicator}>
                {mod.available ? (
                  mod.broken ? (
                    <div className="flex items-center gap-2 text-yellow-400">
                      <span>Имеет баги</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-400">
                      <span>Доступен</span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-2 text-red-400">
                    <span>Недоступен</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className={CSS.modalCloseButton}>
            <Close />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className={CSS.techGrid}>
            <div className={CSS.techSection}>
              <h4 className={CSS.techTitle}>Технические данные</h4>

              <div className="space-y-2">
                <div className={CSS.techItem}>
                  <span className={CSS.techLabel}>Назначение мода:</span>
                  <span className={CSS.techValue}>{mod.purpose}</span>
                </div>
                <div className={CSS.techItem}>
                  <span className={CSS.techLabel}>Размер:</span>
                  <span className={CSS.techValue}>{mod.size.toFixed(2)} МБ</span>
                </div>
                <div className={CSS.techItem}>
                  <span className={CSS.techLabel}>Версия Minecraft:</span>
                  <span className={CSS.techValue}>{minecraftVersion}</span>
                </div>
                <div className={CSS.techItem}>
                  <span className={CSS.techLabel}>ID мода:</span>
                  <span className={`${CSS.techValue} ${CSS.modId}`}>{mod.id}</span>
                </div>
              </div>
            </div>

            <div className={CSS.techSection}>
              <h4 className={CSS.techTitle}>Зависимости</h4>
              {mod.dependencies && mod.dependencies.length > 0 ? (
                <div className="space-y-2">
                  {mod.dependencies.map(dep => (
                    <div key={dep.id} className={CSS.depItem}>
                      <span className={CSS.depName}>{dep.name}</span>
                      <span className={CSS.depSize}>{dep.size.toFixed(2) || '0.00'} МБ</span>
                    </div>
                  ))}
                  <p className={CSS.depNote}>
                    * Зависимости добавляются автоматически при выборе мода
                  </p>
                </div>
              ) : (
                <p className="text-gray-400">Нет зависимостей</p>
              )}
            </div>
          </div>

          {mod.broken && (
            <div className={CSS.warningContainer}>
              <h4 className={CSS.warningTitle}>Внимание!</h4>
              <p className={CSS.warningText}>
                Этот мод может вызывать ошибки или нестабильную работу игры
              </p>
            </div>
          )}

          <div className={CSS.modalFooter}>
            {mod.available && (
              <>
                <button
                  onClick={handleToggleClick}
                  disabled={isRequired}
                  className={`${CSS.addButton} ${
                    isRequired
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : isChecked
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  <div className="flex items-center gap-1 justify-center">
                    {isRequired ? 'Обязательный' : isChecked ? 'Убрать из сборки' : 'Добавить в сборку'}
                    {isRequired ? <Check size={16}/> : isChecked ? <ArrowDown size={16}/> : <ArrowUp size={16}/>}
                  </div>
                </button>
                {downloadUrl && isValidUrl(downloadUrl) && (
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${CSS.downloadButton} ${CSS.downloadPrimary}`}
                    onClick={(e) => { e.stopPropagation() }}
                  >
                    Скачать отдельно
                    <Download size={16}/>
                  </a>
                )}
              </>
            )}
            {mod.site && isValidUrl(mod.site) && (
              <a
                href={mod.site}
                target="_blank"
                rel="noopener noreferrer"
                className={`${CSS.downloadButton} ${CSS.downloadSecondary}`}
                onClick={(e) => { e.stopPropagation() }}
              >
                Страница мода
                <ArrowUpRightFromSquare size={16}/>
            </a>)}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Функция сравнения пропсов для React.memo
 * Перерисовывает только при изменении важных пропсов
 * @param prevProps - Предыдущие пропсы
 * @param nextProps - Новые пропсы
 * @returns true если пропсы равны
 */
const arePropsEqual = (prevProps: ModButtonProps, nextProps: ModButtonProps) => {
  return (
    prevProps.mod.id === nextProps.mod.id &&
    prevProps.mod.name === nextProps.mod.name &&
    prevProps.mod.available === nextProps.mod.available &&
    prevProps.checkedMods.length === nextProps.checkedMods.length &&
    prevProps.checkedMods.every(m => nextProps.checkedMods.some(nm => nm.id === m.id))
  );
};

export default React.memo(ModButtonComponent, arePropsEqual);