import Icon from "../app/ep-logo.svg";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <img src={Icon.src} className="h-6 w-6" />
      <span className="text-lg font-semibold text-white">
        modpack
      </span>
    </div>
  );
}