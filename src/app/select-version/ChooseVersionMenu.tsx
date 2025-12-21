import { ChevronDown, Close } from "flowbite-react-icons/outline";
import MinecraftVersion from "../../types/MinecraftVersion.tsx";
import { Archive, BadgeCheck, Bug, CaretUp, LockTime, } from "flowbite-react-icons/solid";
import { Tooltip } from "../../components/Tooltip.tsx";
import { useState, useEffect, useRef } from "react";

const VERSION_TYPES = {
  EXPERIMENTAL: 1,
  SUPPORTED_AND_RECOMMENDED: 2,
  OUTDATED: 3,
  COMING_SOON: 4,
  SUPPORTED_AND_NOT_RECOMMENDED: 5,
} as const;

interface ChooseVersionMenuProps {
  minecraftVersions: MinecraftVersion[];
  isLoading?: boolean;
}

export default function ChooseVersionMenu({ minecraftVersions, isLoading = false }: ChooseVersionMenuProps) {
  const [dropMenu, setDropMenu] = useState(false);
  const [version, setVersion] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.sessionStorage.getItem("minecraftVersion") || minecraftVersions[0]?.version || '';
    }
    return minecraftVersions[0]?.version || '';
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!version && minecraftVersions[0]) {
      setVersion(minecraftVersions[0].version);
    }
  }, [minecraftVersions, version]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropMenu(false);
      }
    };

    if (dropMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropMenu]);

  return (
    <div className="relative flex flex-col gap-2" ref={dropdownRef}>
      <div className="gap-2">
        <label className="text-sm font-normal text-white">
          Версия Minecraft
        </label>
      </div>
      <div
        className={`flex w-44 items-center justify-between rounded-lg border bg-gray-700 p-1 text-sm font-normal text-white duration-200 ${minecraftVersions.length === 0 && !isLoading ? "border-red-600" : "cursor-pointer border-gray-600 hover:bg-gray-600"}`}
        onClick={() => minecraftVersions.length > 0 && setDropMenu(!dropMenu)}
      >
        <span className="p-2 text-sm leading-tight font-normal text-white">
          {version || "Загрузка..."}
        </span>
        {minecraftVersions.length === 0 && !isLoading ? (
          <Close size={16} className="text-red-400" />
        ) : (
          <ChevronDown
            className={`text-gray-400 transition-transform duration-200 ${dropMenu ? "rotate-180" : ""}`}
          />
        )}
      </div>
      <nav
        className={`transition-opacity duration-100 ease-out ${dropMenu ? `flex` : `pointer-events-none hidden`} absolute top-[84px] w-44 flex-col items-start rounded-lg bg-gray-700 shadow-md`}
      >
        <div className="flex w-full flex-col gap-1 p-2">
          {minecraftVersions.length === 0 ? (
            <div className="p-2 text-center text-sm text-gray-400">
              Нет версий
            </div>
          ) : (
            minecraftVersions.map((ver) => (
              <button
                key={ver.version}
                className={`flex w-full cursor-pointer flex-row items-center gap-2 rounded-md p-1 text-sm leading-tight font-normal text-gray-300 duration-200 hover:bg-gray-600 ${version === ver.version ? "bg-gray-600 text-white" : "hover:bg-gray-600 hover:text-white"}`}
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.sessionStorage.setItem(
                      "minecraftVersion",
                      ver.version,
                    );
                  }
                  setVersion(ver.version);
                  setDropMenu(!dropMenu);
                }}
              >
                <StatusBadge version={ver} />
                {ver.version}
              </button>
            ))
          )}
        </div>
      </nav>
    </div>
  );
}

export function StatusBadge({ version }: { version: MinecraftVersion }) {
  const icon = () => {
    switch (version.status) {
      case VERSION_TYPES.EXPERIMENTAL:
        return <Bug className="cursor-pointer text-yellow-300" size={16}/>
      case VERSION_TYPES.SUPPORTED_AND_RECOMMENDED :
        return <BadgeCheck className=" text-green-400" size={16}/>
      case VERSION_TYPES.OUTDATED :
        return <Archive className="text-red-500" size={16}/>
      case VERSION_TYPES.COMING_SOON :
        return <LockTime className="text-blue-400" size={16}/>
      case VERSION_TYPES.SUPPORTED_AND_NOT_RECOMMENDED :
        return <CaretUp className="text-yellow-300" size={16}/>
    }
  }

  return (
    <Tooltip content={<TooltipContent version={version} />} placement="left" className="shadow-md bg-[color:#2B3544] border border-gray-700">
      {icon()}
    </Tooltip>
  );
}

export function TooltipContent({ version }: { version: MinecraftVersion }) {
  switch (version.status) {
    case VERSION_TYPES.EXPERIMENTAL: return (<TooltipText
      title={"Экспериментальная версия"}
      context={`Для версии ${version.version} ещё не выпущены все обязательные моды, поэтому она может работать нестабильно — используйте на свой страх и риск`} />);
    case VERSION_TYPES.SUPPORTED_AND_RECOMMENDED: return (<TooltipText
      title={"Рекомендуемая версия"}
      context={`Для версии ${version.version} доступны все обязательные моды, она активно поддерживается — рекомендуем использовать именно её`} />);
    case VERSION_TYPES.OUTDATED: return (<TooltipText
      title={"Устаревшая версия"}
      context={`Версия ${version.version} устарела, не обновляется и более не поддерживается на сервере и зайти с нее нельзя — не используйте её`} />);
    case VERSION_TYPES.COMING_SOON: return (<TooltipText
      title={"Ожидается"}
      context={`Версия ${version.version} в скором времени ожидается на сервере, пока что не поддерживается и зайти с нее нельзя — ждите обновлений`} />);
    case VERSION_TYPES.SUPPORTED_AND_NOT_RECOMMENDED: return (<TooltipText
      title={"Поддерживается, но есть новее"}
      context={`Версия ${version.version} поддерживается, но считается устаревшей - рекомендуем перейти на более новую версию для лучшей совместимости`} />);
  }
}

interface TooltipText {
  title: string
  context: string
}

function TooltipText({ title, context }: TooltipText) {
  return (
    <div className="flex flex-col w-[242px] pt-2.5 pb-2.5 pr-3 pl-3 gap-1.5">
      <span className="leading-none text-sm font-medium text-start text-white">{title}</span>
      <span className="leading-tight text-xs font-normal text-start text-gray-400 whitespace-normal">{context}</span>
    </div>
  )
}
