'use client';

import {ChevronDoubleRight} from "flowbite-react-icons/outline";
import {Fragment} from "react";
import {usePathname} from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  const Steps = ["Выбор версии", "Выбор модов", "Загрузка сборки"];

  // Определяем активный шаг по пути
  let activeStep = 0;
  if (pathname === "/select-version") activeStep = 0;
  else if (pathname === "/select-mods") activeStep = 1;
  else if (pathname === "/download-mods") activeStep = 2;

  return (
    <nav className="flex h-[52px] w-[656px] items-center justify-around bg-transparent">
      {Steps.map((step, i) => (
        <Fragment key={i}>
          <div className="flex items-center gap-1.5">
            <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${i === activeStep ? "border-primary-500" : i < activeStep ? "border-white" : "border-gray-400"}`}>
              <span className={`text-xs font-medium ${i === activeStep ? "text-primary-500" : i < activeStep ? "text-white" : "text-gray-400"}`}>
                {i + 1}
              </span>
            </div>
            <div className={`text-base font-medium ${i === activeStep ? "text-primary-500" : i < activeStep ? "text-white" : "text-gray-400"}`}>
              {step}
            </div>
          </div>
          {i < 2 && (<ChevronDoubleRight className="text-gray-400" />)}
        </Fragment>
      ))}
    </nav>
  );
}