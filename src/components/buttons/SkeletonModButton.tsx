export default function SkeletonModButton() {
  return (
    <div className="flex h-[139] w-6xl cursor-pointer flex-row gap-8 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow transition-all duration-100 ease-out">
      <div className="flex w-full items-center justify-between gap-6">
        <div className="h-24 w-24 animate-pulse rounded-lg bg-gray-600" />
        <div className="flex flex-col justify-start h-full pt-1 gap-3">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <div className="h-5 w-[180px] animate-pulse rounded-md bg-gray-600" />
              <div className="h-4 w-[58px] animate-pulse rounded-md bg-gray-700" />
              <div className="h-7 w-30 animate-pulse rounded-md bg-gray-600" />
            </div>
            <div className="h-6 w-6 animate-pulse rounded-md bg-gray-700" />
          </div>
          <div className="relative flex items-start justify-between">
            <div className="h-4 w-[900px] animate-pulse rounded-md bg-gray-700" />
            <div className="ml-18 h-6 w-6 animate-pulse rounded-md bg-gray-700" />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-18 animate-pulse rounded-md bg-gray-700" />
            <div className="h-6 w-22 animate-pulse rounded-md bg-gray-700" />
            <div className="h-6 w-16 animate-pulse rounded-md bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}