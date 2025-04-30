import {ArrowDownToBracket} from "flowbite-react-icons/outline";
import * as React from "react";
import Mod from "../types/Mod.tsx";
import {DownloadMods} from "../elements/DownloadMods.tsx";

export default function ButtonDownload(
    {checkedMods, download, setCompletedCount, setDownloadedBytes, setTotalBytes, setDownload, folderPath, installIps, native} :
    {
        checkedMods : Mod[],
        download: boolean,
        setCompletedCount: React.Dispatch<React.SetStateAction<number>>,
        setDownloadedBytes: React.Dispatch<React.SetStateAction<number>>,
        setTotalBytes: React.Dispatch<React.SetStateAction<number>>,
        setDownload: React.Dispatch<React.SetStateAction<boolean>>,
        folderPath: string,
        installIps: boolean,
        native: boolean
    }
) {
    return (
        <button disabled={download}
            onClick={() => {
                DownloadMods(checkedMods, setCompletedCount, setDownloadedBytes, setTotalBytes, setDownload, folderPath, installIps, native)
            }}
            className={`flex h-[41px] w-[276px] cursor-pointer items-center justify-center gap-2 ${download ? `opacity-50 transition-all duration-200` : `opacity-100 transition-all duration-200`} rounded-lg bg-green-500 pt-2.5 pr-5 pb-2.5 pl-5`}
        >
        <span className="text-sm font-medium text-white">
         {download ? "Скачивание модов..." : `Скачать моды: ~ ${checkedMods.reduce((sum, mod) => sum + mod.size, 0).toFixed(1)} МБ ${ native ? `` : `(.zip)` }`}
        </span>
            { download ? `` : <ArrowDownToBracket className="font-medium text-white" /> }
        </button>
    );
}
