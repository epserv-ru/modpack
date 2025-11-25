import { Links } from "@/app/util/Links.tsx";

interface ModpackLink {
  name: string
  link: string
}

function GetUserOS(): ModpackLink {
  const userAgent = window.navigator.userAgent.toLowerCase();

  if (userAgent.includes('win')) return { name : "Windows", link : Links.APP.WINDOWS };
  if (userAgent.includes('mac')) return { name : "MacOS", link : Links.APP.MACOS };
  if (userAgent.includes('linux')) return { name : "Linux", link : Links.APP.LINUX };
  return { name : "Windows", link : Links.APP.WINDOWS };
}

export default function ButtonDownloadApp() {
  const os = GetUserOS();

  const handleDownload = () => {
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
  };
  return (
    <button
      className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 cursor-pointer transition-colors rounded-lg py-3 px-2"
      onClick={() => {handleDownload()}}
    >
      <span className="font-medium text-white">Скачать для {os.name}</span>
    </button>
  );
}