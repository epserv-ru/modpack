import {ArrowRight} from "flowbite-react-icons/outline";
import * as React from "react";

export default function ButtonNext(
    {activeStep, setActiveStep, loaded} :
    { activeStep : number, setActiveStep : React.Dispatch<React.SetStateAction<number>>, loaded : boolean }
) {
    return (
        <button
            onClick={() => {
                if (activeStep < 2) setActiveStep(activeStep + 1);
            }}
            disabled={!loaded}
            className={`bg-primary-700 flex h-[41px] w-[151px] cursor-pointer items-center justify-center gap-2 rounded-lg pt-2.5 pr-2 pb-2.5 pl-2 ${ loaded ? `opacity-100 transition-all duration-300` : `opacity-50 transition-all duration-300` }`}
        >
            <span className="text-sm font-medium text-white">Продолжить</span>
            <ArrowRight className="font-medium text-white" />
        </button>
    );
}