import { Download, Globe, Phone, Users } from "flowbite-react-icons/solid";

interface InfoBarProps {
  stats: {
    visitors: number;
    downloads: number;
    appDownloads: number;
  };
  onLanguageChange: (lang: 'ru' | 'en') => void;
  onDownloadApp: () => void;
  currentLanguage: 'ru' | 'en';
}

export default function InfoBar({ stats, onLanguageChange, onDownloadApp, currentLanguage }: InfoBarProps) {
  return (
    <div className="border-b border-gray-700 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Левая часть: логотип и статистика */}
          <div className="flex items-center space-x-8">
            <div className="flex space-x-6 text-sm">
              <div className="flex items-center">
                <Users className="mr-2 text-blue-400" size={16} />
                <span className="text-gray-300">
                  <strong className="text-white">{stats.visitors}</strong>
                </span>
              </div>
              <div className="flex items-center">
                <Download className="mr-2 text-green-400" size={16} />
                <span className="text-gray-300">
                  <strong className="text-white">{stats.downloads}</strong>
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 text-purple-400" size={16} />
                <span className="text-gray-300">
                  <strong className="text-white">{stats.appDownloads}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Правая часть: управление */}
          <div className="flex items-center space-x-4">
            {/* Кнопка приложения */}
            <button
              onClick={onDownloadApp}
              className="flex items-center rounded-lg bg-purple-600 px-3 py-2 text-sm text-white transition-colors hover:bg-purple-700"
            >
              <Download size={14} className="mr-1" />
              Приложение
            </button>

            {/* Переключение языка */}
            <div className="flex items-center space-x-2">
              <Globe size={16} className="text-gray-400" />
              <button
                onClick={() => onLanguageChange(currentLanguage === "ru" ? "en" : "ru")}
                className={`rounded px-3 py-1 text-sm font-medium ${currentLanguage === "ru" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"}`}
              >
                RU
              </button>
              <button
                onClick={() => onLanguageChange(currentLanguage === "ru" ? "en" : "ru")}
                className={`rounded px-3 py-1 text-sm font-medium ${currentLanguage === "en" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}