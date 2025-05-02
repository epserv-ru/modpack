import {useEffect, useState} from "react";
import VersionSelectionWindow from "./windows/VersionSelectionWindow.tsx";
import ModsSelectionWindow from "./windows/ModsSelectionWindow.tsx";
import RenderDownload from "./windows/DownloadWindow.tsx";
import ModsRecord from "./types/records/ModsRecord.tsx";


export default function App() {
    const [minecraftVersion, setMinecraftVersion] = useState("")
    const [activeStep, setActiveStep] = useState(0);
    const [checkedMods, setCheckedMods] = useState<ModsRecord>({});
    const [native, setNative] = useState(false);

    useEffect(() => {
        const ua = navigator.userAgent || "";
        if (ua.includes("Electron")) {
            setNative(true)
        }
    }, []);

    switch (activeStep) {
        case 0: return <VersionSelectionWindow
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            minecraftVersion={minecraftVersion}
            setMinecraftVersion={setMinecraftVersion} />
        case 1: return <ModsSelectionWindow
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            minecraftVersion={minecraftVersion}
            checkedMods={checkedMods[minecraftVersion]}
            setCheckedMods={setCheckedMods} />
        case 2: return <RenderDownload
            checkedMods={checkedMods[minecraftVersion]}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            minecraftVersion={minecraftVersion}
            native={native} />
    }
}
