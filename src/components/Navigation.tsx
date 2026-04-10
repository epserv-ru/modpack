'use client';

import { ChevronDoubleRight } from "flowbite-react-icons/outline";
import { Fragment, useMemo } from "react";
import { usePathname } from "next/navigation";

const STEPS_CONFIG: Record<string, { index: number; label: string }> = {
  "/": { index: 0, label: "Выбор версии" },
  "/select-mods":    { index: 1, label: "Выбор модов" },
  "/download-mods":  { index: 2, label: "Загрузка сборки" },
};

const STEPS_LIST = Object.values(STEPS_CONFIG);

export default function Navigation() {
  const pathname = usePathname();
  const activeStep = useMemo(() => STEPS_CONFIG[pathname]?.index, [pathname]);

  return (
    <nav className="flex h-13 w-[656px] items-center justify-around bg-transparent">
      {STEPS_LIST.map(({ index, label }) => {
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;

        const stateColor = isActive ? "text-primary-500 border-primary-500" : isCompleted ? "text-white border-white" : "text-gray-400 border-gray-400";

        return (
          <Fragment key={index}>
            <div className="flex items-center gap-1.5">
              <div className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${stateColor}`}>
                <span className="text-xs font-medium">{index + 1}</span>
              </div>

              <div className={`text-base font-medium transition-colors ${stateColor.split(' ')[0]}`}>
                {label}
              </div>
            </div>

            {index < STEPS_LIST.length - 1 && (
              <ChevronDoubleRight className="text-gray-400" />
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}