import JSZip from "jszip";
import { DownloadState, DownloadSetters } from "@/types/download-state";
import { API_ENDPOINTS } from "@/constants/api";

/**
 * Скачивает моды и сохраняет их
 * @param state - Состояние загрузки
 * @param setters - Сеттеры для обновления состояния
 */
export async function DownloadMods(
  state: DownloadState,
  setters: DownloadSetters
) {
  const { checkedMods, folderPath, installIps, minecraftVersion, native } = state;
  const { setCompletedCount, setDownloadedBytes, setTotalBytes, setDownload } = setters;

  setDownloadedBytes(0);
  setTotalBytes(0);
  setCompletedCount(0);
  setDownload(true);

  const zip = new JSZip();

  if (native) {
    await window.electronAPI?.ensureFolder(`${folderPath}/mods`);

    if (installIps) {
      await fetch(API_ENDPOINTS.SERVERS_JSON)
        .then(res => res.json())
        .catch(console.error)
        .then(ips => window.electronAPI?.addServers(folderPath, ips));
    }
  }

  let total = 0;
  const validMods = checkedMods.filter(mod => mod.reliable_link);
  validMods.forEach(mod => total += mod.size * 1024 * 1024)
  setTotalBytes(total);

  let downloadedBytes = 0;

  await Promise.all(
    validMods.map(async (mod) => {
      if (!mod.reliable_link) {
        setCompletedCount((prev) => prev + 1);
        return;
      }
      try {
        const res = await fetch(mod.reliable_link, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Ошибка при скачивании ${mod.reliable_link}`);

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
        if (native) {
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

  if (!native) {
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

  setDownload(false);
}
