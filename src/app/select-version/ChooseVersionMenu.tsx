import { ChevronDown } from "flowbite-react-icons/outline";
import MinecraftVersion from "../../types/MinecraftVersion.tsx";
import {Archive, BadgeCheck, Bug, CaretUp, LockTime} from "flowbite-react-icons/solid";
import { Tooltip } from "../../components/Tooltip.tsx";
import { useState } from "react";
import {setMinecraftVersion} from "@/hooks/useIsDataLoaded.ts";

export default function ChooseVersionMenu({ minecraftVersions }: { minecraftVersions : MinecraftVersion[] }) {
  const [dropMenu, setDropMenu] = useState(false);
  const [version, setVersion] = useState(minecraftVersions[0].version);

  const dropDownMenu = (
    <nav className={`absolute flex-col w-full top-21 gap-1 p-2 items-start rounded-lg ${dropMenu ? `flex` : `pointer-events-none hidden`} bg-gray-700 shadow-md`}>
      {minecraftVersions.map(ver => (
        <button
          key={ver.version}
          className={`flex flex-row w-full p-1 items-center gap-2 rounded-md text-sm leading-tight font-normal text-gray-300 ${version === ver.version ? "bg-gray-600 text-white" : "hover:text-white hover:bg-gray-600 "} cursor-pointer transition-all ease-in-out duration-200`}
          onClick={() => {
            setMinecraftVersion(ver.version);
            setVersion(ver.version);
            setDropMenu(!dropMenu);
          }}
        >
          <StatusBadge version={ver} />
          {ver.version}
        </button>
      ))}
    </nav>
  )

  return (
    <>
      <div className="flex w-44 items-center justify-between rounded-lg border bg-gray-700 border-gray-600 hover:bg-gray-600 text-sm font-normal transition-all text-white duration-200 cursor-pointer"
           onClick={() => setDropMenu(!dropMenu)}
      >
        <span className="p-3 text-sm leading-tight font-normal text-white">{version}</span>
        <ChevronDown className={`text-gray-400 m-1 transition-all duration-200 ease-in-out ${dropMenu ? "rotate-180" : ""}`}/>
      </div>
      {dropDownMenu}
    </>
  );
}

export function StatusBadge({ version }: { version: MinecraftVersion }) {
  const icon = () => {
    if (version.isExperimental) return <Bug className="cursor-pointer text-yellow-300" size={16}/>
    if (version.isSupportedAndRecommended) return <BadgeCheck className=" text-green-400" size={16}/>
    if (version.isOutdated) return <Archive className="text-red-500" size={16}/>
    if (version.isComingSoon) return <LockTime className="text-blue-400" size={16}/>
    if (version.isSupportedButNotRecommended) return <CaretUp className="text-yellow-300" size={16}/>
  }

  return (
    <Tooltip content={<TooltipContent version={version} />} placement="left" className="shadow-md bg-[#2B3544] border border-gray-700">
      {icon()}
    </Tooltip>
  );
}

export function TooltipContent({ version }: { version: MinecraftVersion }) {
  if (version.isExperimental) return (<TooltipText
    title={"Экспериментальная версия"}
    context={`Для версии ${version.version} ещё не выпущены все обязательные моды, поэтому она может работать нестабильно — используйте на свой страх и риск`} />);

  if (version.isSupportedAndRecommended) return (<TooltipText
    title={"Рекомендуемая версия"}
    context={`Для версии ${version.version} доступны все обязательные моды, она активно поддерживается — рекомендуем использовать именно её`} />);

  if (version.isOutdated) return (<TooltipText
    title={"Устаревшая версия"}
    context={`Версия ${version.version} устарела, не обновляется и более не поддерживается на сервере и зайти с нее нельзя — не используйте её`} />);

  if (version.isComingSoon) return (<TooltipText
    title={"Ожидается"}
    context={`Версия ${version.version} в скором времени ожидается на сервере, пока что не поддерживается и зайти с нее нельзя — ждите обновлений`} />);

  if (version.isSupportedButNotRecommended)return (<TooltipText
    title={"Поддерживается, но есть новее"}
    context={`Версия ${version.version} поддерживается, но считается устаревшей - рекомендуем перейти на более новую версию для лучшей совместимости`} />);
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
