import JSZip from "jszip";
import { DownloadState, DownloadSetters } from "@/types/download-state";

/**
 * Скачивает моды и сохраняет их
 * @param state - Состояние загрузки
 * @param setters - Сеттеры для обновления состояния
 */
export async function ModsDownload(state: DownloadState, setters: DownloadSetters) {
  const { toggledMods, folderPath, minecraftVersion, isNative } = state;
  const { setCompletedCount, setDownloadedBytes, setTotalBytes, setIsDownload } = setters;

  setDownloadedBytes(0);
  setTotalBytes(0);
  setCompletedCount(0);
  setIsDownload(true);

  const zip = new JSZip();

  if (isNative) await window.electronAPI?.ensureFolder(`${folderPath}/mods`);

  let total = 0;
  toggledMods.forEach(mod => total += mod.size * 1024 * 1024)
  setTotalBytes(total);

  let downloadedBytes = 0;

  await Promise.all(
    toggledMods.map(async mod => {
      try {
        const res = await fetch(mod.links.download, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Ошибка при скачивании ${mod.name}`);

        const reader = res.body?.getReader();
        const chunks: Uint8Array[] = [];

        let result = await reader!.read();

        while (!result.done) {
          const value = result.value;
          chunks.push(value);
          downloadedBytes += value.byteLength;
          setDownloadedBytes(downloadedBytes);
          result = await reader!.read();
        }

        const blob = new Blob(chunks);
        const fileName = mod.name.toLowerCase().replace(/\s+/g, "-") + "-" + minecraftVersion + ".jar";
        if (isNative) {
          const arrayBuffer = await blob.arrayBuffer();
          const fullPath = `${folderPath}/mods/${fileName}`;
          await window.electronAPI?.saveFile(fullPath, arrayBuffer);
        } else {
          zip.file(fileName, blob);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setCompletedCount((prev) => prev + 1);
      }
    })
  );

  if (!isNative) {
    const content = await zip.generateAsync({ type: "blob" });
    const objectUrl = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = "ep-modpack-" + minecraftVersion + ".zip";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }

  setIsDownload(false);
}
