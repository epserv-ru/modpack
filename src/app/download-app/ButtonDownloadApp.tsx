'use client';
import { Links } from "@/util/Links.tsx";
import {useCallback, useState} from "react";

interface ModpackLink {
  name: string
  link: string
}

function getUserOS(): ModpackLink {
  const userAgent = window.navigator.userAgent.toLowerCase();

  if (userAgent.includes('win')) return { name : "Windows", link : Links.APP.WINDOWS };
  if (userAgent.includes('mac')) return { name : "MacOS", link : Links.APP.MACOS };
  if (userAgent.includes('linux')) return { name : "Linux", link : Links.APP.LINUX };
  return { name : "Windows", link : Links.APP.WINDOWS };
}

export default function ButtonDownloadApp() {
  const [os, setOS] = useState<ModpackLink | null >(null)
  if (typeof window !== "undefined" && os === null) {
    setOS(getUserOS())
  }

  const handleDownload = useCallback((os: ModpackLink) => {
    try {
      const a = document.createElement('a');
      a.href = os.link;
      a.style.display = 'none';

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      return true;
    } catch (error) {
      console.error('Download error:', error);

      window.open(os.link, '_blank');
      return false;
    }
  }, []);

  return (
    <button
      className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 cursor-pointer transition-colors rounded-lg py-3 px-2"
      onClick={() => {handleDownload(os!)}}
    >
      <span className="font-medium text-white">Скачать для {os?.name ? os!.name : ""}</span>
    </button>
  );
}