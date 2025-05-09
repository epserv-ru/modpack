import { Check } from "flowbite-react-icons/outline";
import Logo from "../elements/Logo.tsx";
import Navigation from "../elements/Navigation.tsx";
import Mod from "../types/Mod.tsx";
import ModButton from "../buttons/ModButton.tsx";
import * as React from "react";
import ButtonNext from "../buttons/ButtonNext.tsx";
import {useEffect, useState} from "react";
import {GetModsData} from "../GetModsData.tsx";
import SkeletonButtonNext from "../buttons/SkeletonButtonNext.tsx";
import SkeletonModButton from "../buttons/SkeletonModButton.tsx";
import ModsRecord from "../types/records/ModsRecord.tsx";
import LoadedVersionRecord from "../types/records/LoadedVersionRecord.tsx";
import { TextFormatter } from "../elements/TextFormatter.tsx";

export default function ModsSelectionWindow(
    { checkedMods, activeStep, minecraftVersion, setCheckedMods, setActiveStep } :
    {
        minecraftVersion: string,
        activeStep : number,
        setActiveStep : React.Dispatch<React.SetStateAction<number>>,
        checkedMods: Mod[],
        setCheckedMods: React.Dispatch<React.SetStateAction<ModsRecord>>
    }) {
    const [mods, setMods] = useState<ModsRecord>({});
    const [loaded, setLoaded] = useState<LoadedVersionRecord>({});

    useEffect(() => {
        GetModsData(minecraftVersion, checkedMods, setMods, setLoaded, setCheckedMods)
    }, []);
    if (loaded[minecraftVersion]) {
        return(
            <main className="flex min-h-screen flex-col items-center overflow-y-hidden bg-gray-900 font-[Inter] select-none">
                <Header activeStep={activeStep} setActiveStep={setActiveStep}/>
                <Body mods={mods[minecraftVersion]} minecraftVersion={minecraftVersion} checkedMods={checkedMods} setCheckedMods={setCheckedMods}/>
                <Footer checkedMods={checkedMods} activeStep={activeStep} setActiveStep={setActiveStep} />
            </main>
        )
    } else {
        return(
            <main className="flex min-h-screen flex-col items-center overflow-y-hidden bg-gray-900 font-[Inter] select-none">
                <Header activeStep={activeStep} setActiveStep={setActiveStep}/>
                <SkeletonBody />
                <SkeletonFooter loaded={loaded[minecraftVersion]} />
            </main>
        )
    }
}

function Header(
    { activeStep, setActiveStep } :
    { activeStep : number, setActiveStep : React.Dispatch<React.SetStateAction<number>> }
) {
  return (
    <div className="fixed flex w-screen justify-center gap-2.5 bg-gray-800 pr-20 pl-20 shadow">
      <div className="inline-flex w-[1280px] items-center justify-between pt-3 pr-8 pb-3 pl-8">
        <Logo />
        <Navigation activeStep={activeStep} setActiveStep={setActiveStep} download={false}/>
      </div>
    </div>
  );
}

function Body(
    { mods, minecraftVersion, checkedMods, setCheckedMods } :
    { mods : Mod[], minecraftVersion : string, checkedMods: Mod[], setCheckedMods: React.Dispatch<React.SetStateAction<ModsRecord>> }
) {
    return (
        <div className="mt-[76px] flex w-screen scrollbar scrollbar-thumb-gray-500 scrollbar-track-rounded-lg scrollbar-track-gray-800 justify-center gap-8 overflow-y-scroll bg-transparent" style={{ height: "calc(100vh - 76px - 65px)" }}>
            <div className=" flex w-[1280px] flex-col gap-8 rounded-lg pt-8 pr-16 pb-8">
                <div className="flex flex-col gap-6 pl-16">
                    <span className="text-2xl leading-tight font-bold text-white">
                        Пора сформировать сборку
                    </span>
                    <span className="text-base font-normal text-gray-400">
                        Для вашего удобства мы уже выбрали несколько модов, которыми пользуются многие игроки на ElectroPlay.
                        <br />
                        Вы можете изменить выбор на свой вкус — просто нажмите на любой мод, чтобы добавить или убрать его.
                        <br />
                        Зависимости к модам выберутся автоматически.
                    </span>
                </div>
                <div className="flex flex-col gap-4 pb-8">
                    {
                        mods
                            .sort((a, b) => {
                                if (a.library !== b.library) return a.library ? 1 : -1;
                                return a.name.localeCompare(b.name);
                            })
                            .map((mod) => (
                                <ModButton key={mod.id} mod={mod} minecraftVersion={minecraftVersion} checkedMods={checkedMods} setCheckedMods={setCheckedMods} />
                            ))
                    }
                </div>
            </div>
        </div>
    )
}

function SkeletonBody() {
    return (
        <div className="mt-[76px] flex w-screen scrollbar scrollbar-thumb-gray-500 scrollbar-track-rounded-lg scrollbar-track-gray-800 justify-center gap-8 overflow-y-scroll bg-transparent" style={{ height: "calc(100vh - 76px - 65px)" }}>
            <div className="flex w-[1280px] flex-col gap-8 rounded-lg pt-8 pr-16 pb-8">
                <div className="flex flex-col gap-6 pl-16">
              <span className="text-2xl leading-tight font-bold text-white">
                Пора сформировать сборку
              </span>
                    <span className="text-base font-normal text-gray-400">
                Для вашего удобства мы уже выбрали несколько модов, которыми
                пользуются многие игроки на ElectroPlay.
                <br />
                Вы можете изменить выбор на свой вкус — просто нажмите на любой
                мод, чтобы добавить или убрать его
              </span>
                </div>

                <div className="flex flex-col gap-4 pb-8">
                    <SkeletonModButton /><SkeletonModButton />
                    <SkeletonModButton /><SkeletonModButton />
                    <SkeletonModButton /><SkeletonModButton />
                    <SkeletonModButton /><SkeletonModButton />
                    <SkeletonModButton /><SkeletonModButton />
                    <SkeletonModButton /><SkeletonModButton />
                    <SkeletonModButton /><SkeletonModButton />
                    <SkeletonModButton /><SkeletonModButton />
                    <SkeletonModButton /><SkeletonModButton />
                    <SkeletonModButton /><SkeletonModButton />
                </div>
            </div>
        </div>
    )
}

function Footer(
    { checkedMods, activeStep, setActiveStep } :
    { checkedMods : Mod[], activeStep : number, setActiveStep : React.Dispatch<React.SetStateAction<number>> }) {
  return (
      <div className="fixed bottom-0 flex w-screen justify-center gap-2.5 bg-gray-700 pr-20 pl-20">
          <div className="inline-flex w-[1280px] items-center justify-end gap-8 pt-3 pr-8 pb-3 pl-8">
              <div className="flex flex-row gap-2">
                  <Check className="text-green-400" />
                  <h1 className="text-base font-normal text-gray-200">
                    {checkedMods.length}{" "}
                    {TextFormatter(checkedMods.length, {one: "мод ", few: "мода ", many: "модов "})}
                    {TextFormatter(checkedMods.length, {one: "выбран", few: "выбрано", many: "выбрано"})}:{" "}
                      {checkedMods.reduce((sum, mod) => sum + mod.size, 0).toFixed(2)}{" "}
                      МБ
                  </h1>
              </div>
              <ButtonNext activeStep={activeStep} setActiveStep={setActiveStep} loaded={true}/>
        </div>
      </div>
  )
}

function SkeletonFooter({ loaded } : { loaded : boolean }) {
    return (
        <div className="fixed bottom-0 flex w-screen justify-center gap-2.5 bg-gray-700 pr-20 pl-20">
            <div className="inline-flex w-[1280px] items-center justify-end gap-8 pt-3 pr-8 pb-3 pl-8">
                <div className="gap-2 w-[180px] h-[16px] bg-gray-500 rounded-md" />
                <SkeletonButtonNext loaded={loaded} />
            </div>
        </div>
    )
}
