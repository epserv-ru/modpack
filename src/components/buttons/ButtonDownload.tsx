import { ArrowDownToBracket } from "flowbite-react-icons/outline";
import * as React from "react";
import { DownloadButtonProps } from "@/types/download-state";
import { DownloadMods } from "../DownloadMods";

/**
 * Кнопка загрузки модов
 * @param props - Пропсы компонента
 */
export default function ButtonDownload(props: DownloadButtonProps) {
  const {
    checkedMods,
    download,
    isLoading,
    setCompletedCount,
    setDownloadedBytes,
    setTotalBytes,
    setDownload,
    folderPath,
    installIps,
    minecraftVersion,
    native
  } = props;

  const totalSize = React.useMemo(
    () => checkedMods.reduce((sum, mod) => sum + mod.size, 0).toFixed(2),
    [checkedMods]
  );

  const handleClick = React.useCallback(() => {
    const state = {
      checkedMods,
      folderPath,
      installIps,
      minecraftVersion,
      native
    };

    const setters = {
      setCompletedCount,
      setDownloadedBytes,
      setTotalBytes,
      setDownload
    };

    DownloadMods(state, setters);
  }, [
    checkedMods,
    folderPath,
    installIps,
    minecraftVersion,
    native,
    setCompletedCount,
    setDownloadedBytes,
    setTotalBytes,
    setDownload
  ]);

  return (
    <button
      disabled={download || isLoading}
      onClick={handleClick}
      className={`flex h-10 items-center justify-center gap-2 rounded-lg bg-green-500 px-5 py-2.5 ${download || isLoading ? `opacity-50 transition-all duration-250` : `transition-all duration-250 hover:bg-green-600 cursor-pointer`}`}
    >
      <span className="text-sm font-medium text-white">
        {download
          ? "Скачивание модов..."
          : `Скачать моды: ~ ${totalSize} МБ ${native ? `` : `(.zip)`}`}
      </span>
      {download ? null : (
        <ArrowDownToBracket className="font-medium text-white" />
      )}
    </button>
  );
}
