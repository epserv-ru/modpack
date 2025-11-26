import Logo from "../Logo.tsx";
import Navigation from "../Navigation.tsx";
import ButtonDownload from "@/components/buttons/ButtonDownload.tsx";
import * as React from "react";
import Mod from "../../types/Mod.tsx";
import { useEffect, useState } from "react";
import { CheckIcon } from "flowbite-react/icons/check-icon";
import { TextFormatter } from "../TextFormatter.tsx";

export default function RenderDownload(
  {checkedMods, minecraftVersion, folderPath, setFolderPath, native}:
  {
    activeStep: number,
    checkedMods: Mod[],
    setActiveStep: React.Dispatch<React.SetStateAction<number>>,
    minecraftVersion: string,
    folderPath: string,
    setFolderPath: React.Dispatch<React.SetStateAction<string>>,
    native: boolean }
) {
  const totalCount = checkedMods.length;
  const [download, setDownload] = useState(false);
  const [installIps, setInstallIps] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [downloadedBytes, setDownloadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const percent = totalBytes ? Math.round((downloadedBytes / totalBytes) * 100) : 0;

  useEffect(() => {
    if (native && !folderPath) window.electronAPI?.getDefaultDir().then(dir => setFolderPath(dir));
  }, [folderPath, native, setFolderPath]);

  const pick = async () => {
    if (!window.electronAPI) {
      alert('Этот браузер не поддерживает выбор папки');
      return;
    }
    const dir = await window.electronAPI.chooseDirectory();
    if (dir) setFolderPath(dir);
  };

  function LoadFolder() {
    return (
      <div className={`flex-col gap-2 ${ native ? `flex` : `hidden` }`}>
        <label className="text-sm font-medium text-white">
          Выберите папку игры
        </label>
        <div className="flex flex-row w-[536px] h-[42px]">
          <button disabled={download} onClick={ () => pick()} className="w-[144px] h-full cursor-pointer rounded-tl-lg rounded-bl-lg border pt-2.5 pb-2.5 gap-2 bg-gray-600 border-gray-600 text-sm font-medium text-white">
            Выбрать папку
          </button>
          <div className="w-[392px] h-full flex items-center rounded-tr-lg rounded-br-lg pt-3 pb-3 pl-4 pr-4 bg-gray-700 border border-gray-600">
                        <span className="leading-tight text-sm font-normal text-white">
                          {folderPath}
                        </span>
          </div>
        </div>
        <label className="text-xs font-normal text-gray-400">
          В этой папке будет создана папка <span className="font-bold">mods</span> (если её нет), в неё будут загружены моды
        </label>
      </div>
    )
  }

  function IpsSet() {
    return (
      <div className={`flex flex-row items-center rounded gap-2 ${ native ? `flex` : `hidden` } ${ download ? `opacity-50` : `opacity-100` }`}>
        <input id="ipsSet" type="checkbox" className="peer hidden" checked={installIps} disabled={download}
               onChange={event => event.target.checked ? setInstallIps(true) : setInstallIps(false)}
        />
        <label htmlFor="ipsSet" className="w-4 h-4 cursor-pointer border flex justify-center items-center border-gray-600 transition-colors duration-150 bg-gray-700 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600">
          <CheckIcon className={`absolute w-3 h-3 text-white transition-opacity duration-150 ${ installIps ? `opacity-100 ` : `opacity-0` }`} />
        </label>
        <span className="text-sm font-medium align-middle text-white">
        Добавить в список серверов региональные адреса <a href="https://epserv.ru/" target="_blank" rel="noopener noreferrer" className="underline text-blue-700"
                                                                      onClick={event => {
                                                                        if (download) event.preventDefault()
                                                                      }}>
                        ElectroPlay
                    </a>
                </span>
      </div>
    )
  }

  function DownloadBar() {
    return (
      <div className={`flex flex-col gap-1 justify-center ${ download ? `` : `hidden` }`}>
        <div className="w-[332px] h-1.5 rounded-sm bg-gray-700">
          <div className="bg-purple-600 h-full rounded-sm transition-all duration-300" style={{ width: `${percent}%` }}/>
        </div>
        <div className="flex flex-row justify-between text-xs font-medium text-gray-400">
          <span>Загружено {completedCount}/{totalCount} модов...</span>
          <span>{percent}%</span>
        </div>
      </div>
    )
  }

  return (
    <main className="flex h-screen w-screen items-center justify-center bg-gray-900 font-[Inter] select-none">
      <div className="flex w-[720px] flex-col gap-6 rounded-lg bg-gray-800 p-8 shadow">
        <Logo />
        <hr className="border-transparent bg-gray-700" />
        <Navigation />
        <span className="text-base font-normal text-gray-400">
                    {TextFormatter(checkedMods.length, {one: "Выбран ", few: "Выбрано ", many: "Выбрано "})}
          {checkedMods.length}{" "}
          {TextFormatter(checkedMods.length, {one: "мод ", few: "мода ", many: "модов "})}
          для Minecraft Java Edition {minecraftVersion}
                </span>
        <LoadFolder />
        <IpsSet />
        <div className="flex flex-row gap-12 justify-between">
          <ButtonDownload
            checkedMods={checkedMods} download={download} setCompletedCount={setCompletedCount}
            setDownloadedBytes={setDownloadedBytes} setTotalBytes={setTotalBytes} setDownload={setDownload}
            folderPath={folderPath} minecraftVersion={minecraftVersion}  installIps={installIps} native={native}
          />
          <DownloadBar />
        </div>
      </div>
    </main>
  );
}