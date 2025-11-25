import { ChevronDown } from "flowbite-react-icons/outline";

export default function SkeletonChooseVersionMenu() {
  return (
    <div className="relative flex flex-col gap-2 w-[174px]">
      <div className="gap-2">
        <label className="text-sm font-normal text-white">
          Версия Minecraft
        </label>
      </div>
      <div className="flex w-[174px] h-[43px] cursor-pointer items-center justify-between rounded-lg border border-gray-600 bg-gray-700 p-1 text-sm font-normal text-white">
        <div className="w-12 p-2 h-3 ml-2 bg-gray-500 rounded-md" />
        <ChevronDown className="text-gray-400"/>
      </div>
    </div>
  );
}