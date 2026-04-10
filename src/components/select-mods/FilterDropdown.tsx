'use client';

import { ChevronDown } from "flowbite-react-icons/outline";
import { useMemo, useState } from "react";

export enum FilterType {
  ALL,
  REQUIRED,
  OPTIONAL,
  RECOMMENDED,
  SELECTED,
}

interface FilterDropdownProps {
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  checkedCount: number;
}

export default function FilterDropdown({activeFilter, setActiveFilter, checkedCount}: FilterDropdownProps) {
  const [dropMenu, setDropMenu] = useState(false);

  const filters = useMemo(() => [
    { value: FilterType.ALL, label: 'Все моды' },
    { value: FilterType.SELECTED, label: checkedCount > 0 ? `Выбранные (${checkedCount})` : `Выбранные` },
    { value: FilterType.REQUIRED, label: 'Обязательные' },
    { value: FilterType.RECOMMENDED, label: 'Рекомендуемые' },
    { value: FilterType.OPTIONAL, label: 'Опциональные' },
  ], [checkedCount]);

  const selectedFilter = filters.find(f => f.value === activeFilter) || filters[0];

  const dropDownMenu = (
    <nav className={`absolute w-full flex-col top-12 gap-1 p-2 items-start rounded-lg ${dropMenu ? `flex` : `pointer-events-none hidden`} bg-gray-700 shadow-md`}>
      {filters.map(filter => (
        <button
          key={filter.value}
          className={`flex p-3 w-full rounded-lg leading-none font-normal text-gray-300 ${activeFilter === filter.value ? 'bg-gray-600 text-white' : 'hover:bg-gray-600 hover:text-white'} transition-all duration-200 ease-in-out cursor-pointer`}
          onClick={() => {
            setActiveFilter(filter.value);
            setDropMenu(!dropMenu);
          }}
        >
          {filter.label}
        </button>
      ))}
    </nav>
  )

  return (
    <>
      <div className="flex items-center justify-between rounded-lg p-1 border bg-gray-700 border-gray-600 hover:bg-gray-600 text-white cursor-pointer"
           onClick={() => setDropMenu(!dropMenu)}
      >
        <span className="pl-2 leading-tight font-semibold text-white">Фильтровать по:</span>
        <span className="pl-2 leading-tight font-semibold text-gray-300">{selectedFilter.label}</span>
        <ChevronDown className={`text-gray-400 m-1 transition-all duration-200 ease-in-out ${dropMenu ? "rotate-180" : ""}`}/>
      </div>
      {dropDownMenu}
    </>
  );
}

