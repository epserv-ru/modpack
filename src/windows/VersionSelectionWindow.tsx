import {ChevronDown} from "flowbite-react-icons/outline";
import {useEffect, useState} from "react";
import {Bug, ShieldCheck} from "flowbite-react-icons/solid";
import MinecraftVersion from "../types/MinecraftVersion.tsx";
import Logo from "../elements/Logo.tsx";
import Navigation from "../elements/Navigation.tsx";
import ButtonNext from "../buttons/ButtonNext.tsx";
import * as React from "react";
import {Tooltip} from "../elements/Tooltip.tsx";
import SkeletonButtonNext from "../buttons/SkeletonButtonNext.tsx";

export default function VersionSelectionWindow(
    {activeStep, setActiveStep, minecraftVersion, setMinecraftVersion}:
    {
        activeStep : number,
        setActiveStep : React.Dispatch<React.SetStateAction<number>>,
        minecraftVersion : string,
        setMinecraftVersion : React.Dispatch<React.SetStateAction<string>>
    }
) {
    const [dropMenu, setDropMenu] = useState(false);
    const [minecraftVersions, setMinecraftVersions] = useState<MinecraftVersion[]>([]);
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        async function getMinecraftVersions() {
            try {
                const result = await fetch("https://raw.githubusercontent.com/epserv-ru/modpack/refs/heads/meta/minecraft_versions.json")
                const versions: MinecraftVersion[] = await result.json()
                setMinecraftVersions(versions)
                if (minecraftVersion == "") setMinecraftVersion(versions[0].version)
                setLoaded(true)
            } catch (err) {
                console.error(err)
            }
        }

        getMinecraftVersions()
    }, []);

    function ChooseVersionMenu() {
        return (
            <div className="relative flex flex-col gap-2 w-[174px]">
                <div className="gap-2">
                  <label className="text-sm font-normal text-white">
                    Версия Minecraft
                  </label>
                </div>
                <label htmlFor="dropdown-toggle" className="flex w-[174px] h-[43px] cursor-pointer items-center justify-between rounded-lg border border-gray-600 bg-gray-700 p-1 text-sm font-normal text-white">
                    <input type="checkbox" id="dropdown-toggle" className="hidden" checked={dropMenu} onChange={() => setDropMenu(!dropMenu)}/>
                    <span className="p-2 align-middle font-[Inter] text-sm leading-tight font-normal text-white">
                      {minecraftVersion}
                    </span>
                    <ChevronDown className="text-gray-400"/>
                </label>
                <nav className={`transition-opacity duration-100 ease-out ${dropMenu ? "flex" : "pointer-events-none hidden"} absolute top-[83px] w-[174px] flex-col items-start rounded-lg bg-gray-700 shadow-md`}>
                    <div className="flex flex-col gap-4 p-4">
                        {minecraftVersions.map(version => (
                            <button key={version.version} className="flex cursor-pointer flex-row gap-2 text-sm leading-none font-normal text-white" onClick={() => {
                                setMinecraftVersion(version.version)
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

  function SkeletonChooseVersionMenu() {
    return (
      <div className="relative flex flex-col gap-2 w-[174px]">
        <div className="gap-2">
          <label className="text-sm font-normal text-white">
            Версия Minecraft
          </label>
        </div>
        <div className="flex w-[174px] h-[43px] cursor-pointer items-center justify-between rounded-lg border border-gray-600 bg-gray-700 p-1 text-sm font-normal text-white">
          <div className="w-12 p-2 h-3 ml-2 bg-gray-500 rounded-md" />
          <ChevronDown className="text-gray-400"/>
        </div>
      </div>
    );
  }

    function StatusBadge({ version } : { version: MinecraftVersion }) {
        return version.experimental ? (
            <Tooltip content={<TooltipContent version={version} />} placement="left" className="shadow-md bg-[color:#2B3544]">
                <Bug className="h-[15px] w-[15px] cursor-pointer text-yellow-300" />
            </Tooltip>) : (
            <Tooltip content={<TooltipContent version={version} />} placement="left" className="shadow-md bg-[color:#2B3544]">
                <ShieldCheck className="h-[15px] w-[15px] text-green-400" />
            </Tooltip>
        );
    }

    function TooltipContent({ version } : { version: MinecraftVersion }) {
        if (version.experimental) {
           return(
               <div className="flex flex-col w-[289px] p-2.5 pb-2.5 pr-3 pl-3 gap-1.5">
                    <span className="leading-none text-sm font-medium text-start text-white">
                        Экспериментальная версия
                    </span>
                   <span className="leading-tight text-xs font-normal text-start text-gray-400 whitespace-normal">
                        Для версии {version.version} ещё не выпущены все обязательные моды, поэтому она может работать нестабильно — используйте на свой страх и риск
                    </span>
               </div>
           )
        } else {
            return(
                <div className="flex flex-col w-[242px] pt-2.5 pb-2.5 pr-3 pl-3 gap-1.5">
                    <span className="leading-none text-sm font-medium text-start text-white">
                        Рекомендуемая версия
                    </span>
                    <span className="leading-tight text-xs font-normal text-start text-gray-400 whitespace-normal">
                        Для версии {version.version} доступны все обязательные моды, она активно поддерживается — рекомендуем использовать именно её
                    </span>
                </div>
            )
        }
    }

    if (loaded) {
      return (
        <main className="flex h-screen w-screen items-center justify-center bg-gray-900 font-inter select-none">
          <div className="flex w-[720px] flex-col gap-6 rounded-lg bg-gray-800 p-8 shadow">
            <Logo />
            <hr className="border-transparent bg-gray-700" />
            <Navigation activeStep={activeStep} setActiveStep={setActiveStep} download={false}/>
              <span style={{ fontSize: 17 }} className="text-base font-normal text-gray-400">
                    Выберите версию Minecraft Java Edition, для которой нужно установить моды.
                    Отдаем приоритет рекомендуемой версии — на ней модпак стабильнее и имеет больший выбор модов.
                </span>
            <ChooseVersionMenu />
            <ButtonNext activeStep={activeStep} setActiveStep={setActiveStep} loaded={loaded}/>
          </div>
        </main>
      )
    } else {
      return (
        <main className="flex h-screen w-screen items-center justify-center bg-gray-900 font-inter select-none">
          <div className="flex w-[720px] flex-col gap-6 rounded-lg bg-gray-800 p-8 shadow">
            <Logo />
            <hr className="border-transparent bg-gray-700" />
            <Navigation activeStep={activeStep} setActiveStep={setActiveStep} download={false}/>
            <span style={{ fontSize: 17 }} className="text-base font-normal text-gray-400">
                    Выберите версию Minecraft Java Edition, для которой нужно установить моды. Рекомендуем выбирать последнюю — для неё модпак регулярно обновляется
                </span>
            <SkeletonChooseVersionMenu />
            <SkeletonButtonNext loaded={loaded}/>
          </div>
        </main>
      )
    }
}

