import { createContext, useEffect, useState } from "react";
import ModsRecord from "./types/records/ModsRecord.tsx";
import Page from "@/app/about/page.tsx";


export default function App() {
  const CheckedMods  = createContext<ModsRecord>({});
  const [native, setNative] = useState(false);
  const [folderPath, setFolderPath] = useState("")

    useEffect(() => {
        const ua = navigator.userAgent || "";
        if (ua.includes("Electron")) {
            setNative(true)
        }
    }, []);

    return(<Page />)






    //   case -1: return <Page
    //   case 0: return(
    //     <VersionSelectionWindow
    //     activeStep={activeStep}
    //     setActiveStep={setActiveStep}
    //     minecraftVersion={minecraftVersion}
    //     setMinecraftVersion={setMinecraftVersion} />)
    //   case 1: return <Page
    //     activeStep={activeStep}
    //     setActiveStep={setActiveStep}
    //     minecraftVersion={minecraftVersion}
    //     checkedMods={checkedMods[minecraftVersion]}
    //     setCheckedMods={setCheckedMods} />
    //   case 2: return <RenderDownload
    //     checkedMods={checkedMods[minecraftVersion]}
    //     activeStep={activeStep}
    //     setActiveStep={setActiveStep}
    //     minecraftVersion={minecraftVersion}
    //     folderPath={folderPath}
    //     setFolderPath={setFolderPath}
    //     native={native} />
    // }
}
