import Icon from "../assets/img/ep-logo.svg";

export default function Logo() {
    return (
        <div className="flex h-[27px] items-center gap-2">
            <img src={Icon} className="h-6 w-6" alt="Лого" />
            <span className="text-[18px] leading-7 font-semibold text-white">
                modpack
            </span>
            <span className="h-6 text-[10px] leading-7 font-semibold text-gray-400">
                v2.0
            </span>
        </div>
    );
}