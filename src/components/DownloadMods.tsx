import JSZip from "jszip";
import Mod from "../types/Mod.tsx";
import {Dispatch, SetStateAction} from "react";

export async function DownloadMods(
  checkedMods: Mod[],
  setCompletedCount: Dispatch<SetStateAction<number>>,
  setDownloadedBytes: Dispatch<SetStateAction<number>>,
  setTotalBytes: Dispatch<SetStateAction<number>>,
  setDownload: Dispatch<SetStateAction<boolean>>,
  folderPath: string,
  installIps: boolean,
  minecraftVersion: string,
  native: boolean
) {
  setDownload(true)
  const zip = new JSZip();

  if (native) {
    await window.electronAPI?.ensureFolder(`${folderPath}/mods`)

    if (installIps) {
      await fetch("https://raw.githubusercontent.com/epserv-ru/modpack/refs/heads/meta/servers.json")
        .then(async res => await res.json())
        .catch(console.error)
        .then(ips => window.electronAPI?.addServers(folderPath, ips))
    }
  }

  let total = 0;
  await Promise.all(
    checkedMods.map(async (mod) => {
      try {
        const head = await fetch(mod.reliable_link,  { method: "HEAD", cache: 'no-store' });
        const len = head.ok ? parseInt(head.headers.get("Content-Length") || "0", 10) : 0;
        total += len;
      } catch(err) {
        console.error(err)
      }
    })
  );
  setTotalBytes(total);
  total = 0

  let downloaded = 0;
  const downloadTasks = checkedMods.map(async (mod) => {
    try {
      const res = await fetch(mod.reliable_link, {cache: 'no-store'});
      if (!res.ok) throw new Error(`Ошибка при скачивании ${mod.reliable_link}`);

      const reader = res.body!.getReader();
      const chunks: Uint8Array[] = [];

      while (true) {
        const {done, value} = await reader.read();
        if (done) break;
        chunks.push(value!);
        downloaded += value!.byteLength;
        setDownloadedBytes(downloaded);
      }

      const blob = new Blob(chunks);
      const fileName = mod.name.toLowerCase().replace(/\s+/g, "-") + "-" + minecraftVersion + ".jar";
      if (native) {
        const arrayBuffer = await blob.arrayBuffer();
        const fullPath = `${folderPath}/mods/${fileName}`
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        await window.electronAPI.saveFile(fullPath, arrayBuffer)
      } else {
        zip.file(fileName, blob);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCompletedCount((prev) => prev + 1);
    }
  });

  await Promise.all(downloadTasks)

  if (!native) {
    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "ep-modpack-" + minecraftVersion + ".zip";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  setDownload(false)
  setDownloadedBytes(0)
  setTotalBytes(0)
  setCompletedCount(0)
}
