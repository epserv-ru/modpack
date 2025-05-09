import {ArrowUpRightFromSquare, ExclamationCircle} from "flowbite-react-icons/solid";
import Mod from "../types/Mod.tsx";
import * as React from "react";
import {Tooltip} from "../elements/Tooltip.tsx";
import ModsRecord from "../types/records/ModsRecord.tsx";
import Markdown from "react-markdown";

export default function ModButton(
    { mod, minecraftVersion, checkedMods, setCheckedMods } :
    {
        mod : Mod,
        minecraftVersion : string,
        checkedMods: Mod[],
        setCheckedMods: React.Dispatch<React.SetStateAction<ModsRecord>>
    }
) {
    return (
        <div className="flex flex-row justify-between items-center">
            <div className="flex w-16 h-8 items-center justify-center">
                <Tooltip content={<NotAvailableTooltipContent mod={mod} minecraftVersion={minecraftVersion}/>} placement="top" className="bg-gray-800 shadow-md">
                    <ExclamationCircle className={`gap-0 ${mod.available ? `text-transparent hidden` : `text-red-500`}`}/>
                </Tooltip>
            </div>
            <input type="checkbox" id={`${mod.id}`} className="peer hidden" checked={(mod.required && mod.available) || checkedMods.some(m => m.id === mod.id)} disabled={mod.required || !mod.available}
                onChange={event => {
                    const isOn = event.target.checked;
                    setCheckedMods(prev => {
                        const current = prev[minecraftVersion] || [];
                        const map = new Map<string, Mod>(
                            current.map(mod => [mod.id, mod])
                        );

                        if (isOn) {
                            const addRec = (mod: Mod) => {
                                if (!map.has(mod.id)) {
                                    map.set(mod.id, mod);
                                    mod.dependencies?.forEach(addRec);
                                }
                            };
                            addRec(mod);
                        } else {
                            map.delete(mod.id);
                            (mod.dependencies || []).forEach(dep => {
                                const stillNeeded = Array.from(map.values()).some(
                                    mod => mod.dependencies?.some(dependence => dependence.id === dep.id)
                                );
                                if (!stillNeeded) {
                                    map.delete(dep.id);
                                }
                            });
                        }

                        return {
                            ...prev,
                            [minecraftVersion]: Array.from(map.values())
                        };
                    });
                }}
            />
            <label htmlFor={`${mod.id}`} className={`flex h-[128px] w-[1152px] cursor-pointer ${!mod.available ? `opacity-50` : ``} flex-row gap-8 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow transition-colors duration-100 ease-out peer-checked:border-green-700 peer-checked:bg-green-900 ${mod.required ? `peer-checked:border-green-700 peer-checked:bg-green-900` : ``}`}
            ><img src={mod.icon_url} className="h-24 w-24 rounded-lg" alt="Лого мода"/>
                <div className="flex flex-col gap-3">
                    <div className="flex w-247.5 flex-row items-center justify-between">
                        <div className="flex flex-row items-center gap-2">
                            <h1 className="text-xl leading-tight font-semibold text-white">
                                {mod.name}
                            </h1>
                            <h1 className="text-base leading-none font-normal text-gray-400">
                                {mod.size.toFixed(2)} МБ
                            </h1>
                        </div>
                        <a href={mod.site} target="_blank" rel="noopener noreferrer">
                            <ArrowUpRightFromSquare className="cursor-pointer text-gray-400" />
                        </a>
                    </div>
                    <div className="text-base leading-none font-normal text-gray-400">
                      <Markdown>{mod.description}</Markdown>
                    </div>
                </div>
            </label>
        </div>
    );
}

function NotAvailableTooltipContent(
    { mod, minecraftVersion } :
    { mod : Mod, minecraftVersion : string }
) {
    return (
        <div className="flex flex-col p-2.5 pb-2.5 pr-3 pl-3 gap-1.5">
            <span className="leading-none text-sm font-medium text-start text-white">
                Этот мод установить нельзя
            </span>
            <span className="leading-tight text-xs font-normal text-start text-gray-400 whitespace-normal">
                {mod.name} еще не вышел на версию {minecraftVersion}
            </span>
        </div>
    )
}