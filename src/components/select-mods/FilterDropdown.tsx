'use client';

import { ChevronDown } from "flowbite-react-icons/outline";
import { useMemo, useState, useRef, useEffect } from "react";

export enum FilterType {
  ALL,
  LIBRARY,
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

export default function FilterDropdown({
  activeFilter,
  setActiveFilter,
  checkedCount,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filters = useMemo(() => [
    { value: FilterType.ALL, label: 'Все моды' },
    { value: FilterType.SELECTED, label: `Выбранные (${checkedCount})` },
    { value: FilterType.LIBRARY, label: 'Библиотеки' },
    { value: FilterType.REQUIRED, label: 'Обязательные' },
    { value: FilterType.RECOMMENDED, label: 'Рекомендуемые' },
    { value: FilterType.OPTIONAL, label: 'Необязательные' },
  ], [checkedCount]);

  const selectedFilter = filters.find(f => f.value === activeFilter) || filters[0];

  const handleSelect = (value: FilterType) => {
    setActiveFilter(value);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => { setIsOpen(!isOpen) }}
        className="flex items-center justify-between cursor-pointer rounded-lg border border-gray-600 bg-gray-700 p-2 duration-200 hover:bg-gray-600 text-white"
      >
        <span className="pl-2 leading-tight font-semibold text-white">Фильтровать по:</span>
        <span className="px-2 leading-tight font-semibold text-gray-300">{selectedFilter.label}</span>
        <ChevronDown className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}/>
      </button>

      {isOpen && (
        <nav className="absolute mt-2 flex flex-col items-start rounded-lg bg-gray-700 w-full">
          <div className="flex flex-col gap-1 p-2 w-full">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => { handleSelect(filter.value) }}
                className={`flex cursor-pointer items-center duration-200 w-full p-3 rounded-lg leading-none font-normal text-gray-300 transition-colors ${activeFilter === filter.value ? 'bg-gray-600 text-white' : 'hover:bg-gray-600 hover:text-white'}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
