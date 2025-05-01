import Icon from "../assets/img/ep-logo.svg";

export default function Logo() {
    return (
        <div className="flex items-center gap-2">
            <img src={Icon} className="h-6 w-6" alt="Лого" />
            <span className="text-lg font-semibold text-white">
                modpack
            </span>
            <span className="h-[22px] text-[10px] leading-7 text-gray-400">
                v2.0
            </span>
        </div>
    );
}