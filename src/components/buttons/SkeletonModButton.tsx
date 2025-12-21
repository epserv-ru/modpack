export default function SkeletonModButton() {
  return (
    <div className="flex flex-row justify-between items-center ">
      <div className="flex h-[128px] w-[1152px] cursor-pointer flex-row gap-8 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow">
        <div className="h-24 w-24 rounded-lg bg-gray-600 animate-pulse" />
        <div className="flex flex-col gap-3">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <div className="w-[180px] h-5 rounded-md bg-gray-600 animate-pulse" />
              <div className="w-[58px] h-4 rounded-md bg-gray-700 animate-pulse" />
            </div>
            <div className="w-5 h-5 rounded-md bg-gray-700 animate-pulse" />
          </div>
          <div className="flex flex-col pt-[5px] pb-2.5 gap-[7px]">
            <div className="w-[990px] h-[9px] rounded-xl p-1 gap-2.5 bg-gray-700 animate-pulse" />
            <div className="w-[990px] h-[9px] rounded-xl p-1 gap-2.5 bg-gray-700 animate-pulse" />
            <div className="w-[533px] h-[9px] rounded-xl p-1 gap-2.5 bg-gray-700 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}