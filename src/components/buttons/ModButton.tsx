import {
  ArrowUpRightFromSquare,
  ExclamationCircle,
  X,
  Download,
  InfoCircle,
} from "flowbite-react-icons/solid";
import Mod from "../../types/Mod.tsx";
import * as React from "react";
import {Tooltip} from "../Tooltip.tsx";
import ModsRecord from "../../types/records/ModsRecord.tsx";
import Markdown from "react-markdown";
import { useState } from "react";
import { Check } from "flowbite-react-icons/outline";

export default function ModButton(
  { mod, minecraftVersion, checkedMods, setCheckedMods } :
  {
    mod : Mod,
    minecraftVersion : string,
    checkedMods: Mod[],
    setCheckedMods: React.Dispatch<React.SetStateAction<ModsRecord>>
  }
) {
  const [showPreview, setShowPreview] = useState(false);
  const isChecked = checkedMods.some(m => m.id === mod.id);
  const isRequired = mod.required && mod.available;

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <div className="flex w-16 h-8 items-center justify-center">
          <Tooltip content={<TooltipContent mod={mod} minecraftVersion={minecraftVersion}/>} placement="top" className="bg-gray-800 shadow-md">
            <ExclamationCircle className={`${mod.available ? `${mod.broken ? 'text-yellow-300' : 'text-transparent hidden'}` : `text-red-500`}`}/>
          </Tooltip>
        </div>
        <input type="checkbox" id={`${mod.id}`} className="peer hidden" checked={isRequired || isChecked} disabled={mod.required || !mod.available}
               onChange={event => {
                 const isOn = event.target.checked;
                 setCheckedMods(prev => {
                   const current = prev[minecraftVersion] || [];
                   const map = new Map<string, Mod>(
                     current.map(mod => [mod.id, mod])
                   );

                   if (isOn) {
                     const addRec = (mod: Mod) => {
                       if (!map.has(mod.id)) {
                         map.set(mod.id, mod);
                         mod.dependencies?.forEach(addRec);
                       }
                     };
                     addRec(mod);
                   } else {
                     map.delete(mod.id);
                     (mod.dependencies || []).forEach(dep => {
                       const stillNeeded = Array.from(map.values()).some(
                         mod => mod.dependencies?.some(dependence => dependence.id === dep.id)
                       );
                       if (!stillNeeded) {
                         map.delete(dep.id);
                       }
                     });
                   }

                   return {
                     ...prev,
                     [minecraftVersion]: Array.from(map.values())
                   };
                 });
               }}
        />
        <label htmlFor={`${mod.id}`} className={`flex h-[128px] w-[1152px] cursor-pointer ${!mod.available ? `opacity-50` : ``} flex-row gap-8 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow transition-colors duration-100 ease-out peer-checked:border-green-700 peer-checked:bg-green-900 ${mod.required ? `peer-checked:border-green-700 peer-checked:bg-green-900` : ``}`}
        >
          <img src={mod.icon_url} className="h-24 w-24 rounded-lg" alt="Лого мода"/>
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-2">
                <h1 className="text-xl leading-tight font-semibold text-white">
                  {mod.name}
                </h1>
                <h1 className="text-base leading-none font-normal text-gray-400">
                  {mod.size.toFixed(2)} МБ
                </h1>
                {mod.required && (
                  <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                                        Обязательный
                                    </span>
                )}
                {mod.library && (
                  <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded-full">
                                        Библиотека
                                    </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPreview(true);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                  title="Детальная информация"
                >
                  <InfoCircle className="w-5 h-5" />
                </button>
                <a href={mod.site} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-green-400 transition-colors">
                  <ArrowUpRightFromSquare className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div className="text-base leading-none font-normal text-gray-400">
              <Markdown>{mod.description}</Markdown>
            </div>
            <div className="flex gap-2 mt-2">
              {mod.dependencies && mod.dependencies.length > 0 && (
                <span className="text-xs text-gray-500">
                                    Зависимости: {mod.dependencies.length}
                                </span>
              )}
            </div>
          </div>
        </label>
      </div>

      <EnhancedModPreviewModal
        mod={mod}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        minecraftVersion={minecraftVersion}
        isChecked={isChecked}
        isRequired={isRequired}
        onToggle={() => {
          if (!mod.required && mod.available) {
            document.getElementById(`${mod.id}`)?.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }}
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

// Улучшенное модальное окно с технической информацией
function EnhancedModPreviewModal(
  { mod, isOpen, onClose, minecraftVersion, isChecked, isRequired, onToggle}:
  {
    mod: Mod,
    isOpen: boolean,
    onClose: () => void,
    minecraftVersion: string,
    isChecked: boolean,
    isRequired: boolean,
    onToggle: () => void
  }) {
  if (!isOpen) return null;

  const downloadUrl = mod.reliable_link || mod.site;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Заголовок */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <img src={mod.icon_url} className="h-16 w-16 rounded-lg" alt="Лого мода"/>
            <div>
              <h3 className="text-xl font-bold text-white">{mod.name}</h3>
              <p className="text-gray-400 text-sm">v{mod.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl p-1">
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Статус и управление */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-700 rounded-lg">
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Статус</h4>
              <div className="flex items-center gap-2">
                {mod.available ? (
                  mod.broken ? (
                    <div className="flex items-center gap-2 text-yellow-400">
                      <ExclamationCircle className="w-4 h-4" />
                      <span>Имеет баги</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-400">
                      <Check className="w-4 h-4" />
                      <span>Доступен</span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-2 text-red-400">
                    <X className="w-4 h-4" />
                    <span>Недоступен</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Управление</h4>
              <button
                onClick={onToggle}
                disabled={isRequired || !mod.available}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isRequired || !mod.available
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : isChecked
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isRequired ? 'Обязательный' : isChecked ? 'Убрать из сборки' : 'Добавить в сборку'}
              </button>
            </div>
          </div>

          {/* Техническая информация */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">Технические данные</h4>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Тип мода:</span>
                  <span className="text-white">
                                        {mod.library ? 'Библиотека' : mod.type === 'client' ? 'Клиентский' : 'Серверный'}
                                    </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Размер:</span>
                  <span className="text-white">{mod.size.toFixed(2)} МБ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Версия Minecraft:</span>
                  <span className="text-white">{minecraftVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ID мода:</span>
                  <span className="text-white font-mono text-sm">{mod.id}</span>
                </div>
              </div>
            </div>

            {/* Зависимости */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Зависимости</h4>
              {mod.dependencies && mod.dependencies.length > 0 ? (
                <div className="space-y-2">
                  {mod.dependencies.map(dep => (
                    <div key={dep.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                      <span className="text-white text-sm">{dep.name}</span>
                      <span className="text-gray-400 text-xs">{dep.size?.toFixed(2)} МБ</span>
                    </div>
                  ))}
                  <p className="text-gray-400 text-xs mt-2">
                    * Зависимости добавляются автоматически при выборе мода
                  </p>
                </div>
              ) : (
                <p className="text-gray-400">Нет зависимостей</p>
              )}
            </div>
          </div>

          {/* Совместимость и предупреждения */}
          {(mod.broken) && (
            <div className="p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
              <h4 className="text-lg font-semibold text-yellow-200 mb-2">Внимание</h4>
              {mod.broken && (
                <p className="text-yellow-100 text-sm">
                  Этот мод может вызывать ошибки или нестабильную работу игры
                </p>
              )}
            </div>
          )}

          {/* Действия */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              {isChecked ? (
                <span className="text-green-400">✓ Включен в вашу сборку</span>
              ) : (
                <span>Не выбран для установки</span>
              )}
            </div>

            <div className="flex gap-3">
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Скачать отдельно
              </a>
              <a
                href={mod.site}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
              >
                <ArrowUpRightFromSquare className="w-4 h-4" />
                Страница мода
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}