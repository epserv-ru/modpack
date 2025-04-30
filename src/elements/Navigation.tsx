import {ChevronDoubleRight} from "flowbite-react-icons/outline";
import React from "react";

export default function Navigation(
    { activeStep, setActiveStep, download } :
    { activeStep : number, setActiveStep: React.Dispatch<React.SetStateAction<number>>, download: boolean}
) {
    const Steps = ["Выбор версии", "Выбор модов", "Загрузка сборки"];
    return (
        <nav className="flex h-[52px] w-[656px] items-center justify-around bg-transparent">
            {Steps.map((step, i) => (
                <>
                    <div key={i} className="flex items-center gap-1.5">
                        <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${i === activeStep ? "border-primary-500" : i < activeStep ? "border-white" : "border-gray-400"}`}>
                            <span className={`text-xs font-medium ${i === activeStep ? "text-primary-500" : i < activeStep ? "text-white" : "text-gray-400"}`}>
                                {i + 1}
                            </span>
                        </div>
                        <button key={i}
                            onClick={() => {
                                if (i < activeStep) {
                                    setActiveStep(i);
                                }
                            }}
                            disabled={i >= activeStep || download}
                            className={`cursor-pointer text-base font-medium ${i === activeStep ? "text-primary-500 cursor-default" : i < activeStep ? "text-white" : "text-gray-400 cursor-not-allowed"}`}>
                            {step}
                        </button>
                    </div>
                    {i < 2 && (<ChevronDoubleRight className="text-gray-400" />)}
                </>
            ))}
        </nav>
    );
}