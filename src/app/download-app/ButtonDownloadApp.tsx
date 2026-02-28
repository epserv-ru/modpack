'use client';
import {useCallback} from "react";
import {useUserOS, type ModpackLink} from "@/hooks/useUserOS.ts";

export default function ButtonDownloadApp() {
  const os = useUserOS();

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
      onClick={() => {handleDownload(os as ModpackLink)}}
    >
      <span className="font-medium text-white">Скачать для {os?.name ? os!.name : ""}</span>
    </button>
  );
}
