import { ChevronDown } from "flowbite-react-icons/outline";
import MinecraftVersion from "../../types/MinecraftVersion.tsx";
import { Archive, BadgeCheck, Bug, CaretUp, LockTime, } from "flowbite-react-icons/solid";
import { Tooltip } from "../../elements/Tooltip.tsx";
import SkeletonChooseVersionMenu from "./SkeletonChooseVersionMenu.tsx";
import { useState } from "react";

const VERSION_TYPES = {
  EXPERIMENTAL: 1,
  SUPPORTED_AND_RECOMMENDED: 2,
  OUTDATED: 3,
  COMING_SOON: 4,
  SUPPORTED_AND_NOT_RECOMMENDED: 5,
} as const;

export default function ChooseVersionMenu({ minecraftVersions } : { minecraftVersions: MinecraftVersion[] }) {
  const [dropMenu, setDropMenu] = useState(false);
  if (minecraftVersions.length == 0) return (<SkeletonChooseVersionMenu/>);

  return (
    <div className="relative flex flex-col gap-2">
      <div className="gap-2">
        <label className="text-sm font-normal text-white">Версия Minecraft</label>
      </div>
      <label htmlFor="dropdown-toggle" className="flex w-[174px] cursor-pointer items-center justify-between rounded-lg border border-gray-600 bg-gray-700 p-1 duration-200 hover:bg-gray-600 text-sm font-normal text-white">
        <input type="checkbox" id="dropdown-toggle" className="hidden" checked={dropMenu} onChange={() => setDropMenu(!dropMenu)}/>
        <span className="p-2 text-sm leading-tight font-normal text-white">{window.sessionStorage.getItem("minecraftVersion")}</span>
        <ChevronDown className={`text-gray-400 transition-transform duration-200 ${dropMenu ? 'rotate-180' : ''}`}/>
      </label>
      <nav className={`transition-opacity duration-100 ease-out ${dropMenu ? `flex` : `pointer-events-none hidden`} absolute top-[83px] w-[174px] flex-col items-start rounded-lg bg-gray-700 shadow-md`}>
        <div className="flex flex-col p-2 w-full">
          {minecraftVersions.map(version => (
            <button key={version.version} className="flex cursor-pointer items-center flex-row duration-100 w-full rounded-md gap-2 p-1 hover:bg-gray-600 hover:border-gray-500 text-sm leading-none font-normal text-white" onClick={() => {
              window.sessionStorage.setItem("minecraftVersion", version.version)
              setDropMenu(!dropMenu);
            }}>
              <StatusBadge version={version}/>
              {version.version}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export function StatusBadge({ version } : { version: MinecraftVersion }) {
  const icon = () => {
    switch (version.status) {
      case VERSION_TYPES.EXPERIMENTAL :
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

export function TooltipContent({ version } : { version: MinecraftVersion }) { //TODO перебрать текст
  switch (version.status) {
    case VERSION_TYPES.EXPERIMENTAL : return(<TooltipText
      title={"Экспериментальная версия"}
      context={`Для версии ${version.version} ещё не выпущены все обязательные моды, поэтому она может работать нестабильно — используйте на свой страх и риск`} />)
    case VERSION_TYPES.SUPPORTED_AND_RECOMMENDED : return(<TooltipText
      title={"Рекомендуемая версия"}
      context={`Для версии ${version.version} доступны все обязательные моды, она активно поддерживается — рекомендуем использовать именно её`} />)
    case VERSION_TYPES.OUTDATED : return(<TooltipText
      title={"Устаревшая версия"}
      context={`Версия ${version.version} устарела, не обновляется и более не поддерживается на сервере и зайти с нее нельзя — не используйте её`} />)
    case VERSION_TYPES.COMING_SOON : return(<TooltipText
      title={"Ожидается"}
      context={`Версия ${version.version} в скором времени ожидается на сервере, пока что не поддерживается и зайти с нее нельзя — ждите обновлений`} />)
    case VERSION_TYPES.SUPPORTED_AND_NOT_RECOMMENDED : return(<TooltipText
      title={"Поддерживается, но есть новее"}
      context={`Версия ${version.version} поддерживается, но считается устаревшей - рекомендуем перейти на более новую версию для лучшей совместимости`} />)
  }
}

interface TooltipText {
  title : string
  context : string
}

function TooltipText({ title, context } : TooltipText) {//TODO убрать w
  return(
    <div className="flex flex-col w-[242px] pt-2.5 pb-2.5 pr-3 pl-3 gap-1.5">
      <span className="leading-none text-sm font-medium text-start text-white">{title}</span>
      <span className="leading-tight text-xs font-normal text-start text-gray-400 whitespace-normal">{context}</span>
    </div>
  )
}