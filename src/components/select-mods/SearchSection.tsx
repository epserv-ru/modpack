'use client';

import { Close, Search } from "flowbite-react-icons/outline";
import { FilterType } from "./FilterDropdown";
import FilterDropdown from "./FilterDropdown";
import CategoryFilter from "@/components/select-mods/CategoryFilter.tsx";
import { Category } from "@/types/EPMod.tsx";
import React, {useRef} from "react";

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  toggledCount: number;
  filteredCount: number;
  onSelectAll: () => void;
  onReset: () => void;
  selectedCategories: Category[];
  toggleCategory: (category: Category) => void;
}

export default function SearchSection({searchQuery, setSearchQuery, activeFilter, setActiveFilter, toggledCount, filteredCount, onSelectAll, onReset, selectedCategories, toggleCategory}: SearchSectionProps) {
  return (
    <>
      <div className="flex flex-row gap-4 items-center">
        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
        <FilterDropdownWrapper activeFilter={activeFilter} setActiveFilter={setActiveFilter} checkedCount={toggledCount}/>
        <ActionButton className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 font-medium text-white transition-all duration-200 ease-in-out cursor-pointer"
          id="mods-select-all"
          onClick={onSelectAll}
          label="Выбрать все"
        />
        <ActionButton className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 font-medium text-white transition-all duration-200 ease-in-out cursor-pointer"
          onClick={onReset}
          label="Сбросить"
        />
        <div className="text-sm text-gray-400">Найдено: {filteredCount}</div>
      </div>
      <div id="mods-categories" className="flex flex-row gap-4 items-center">
        <CategoryFilter selectedCategories={selectedCategories} onToggleCategory={toggleCategory}
        />
      </div>
    </>
  );
}

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

function SearchInput({ searchQuery, setSearchQuery }: SearchInputProps) {
  const highlightRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLInputElement>) => {
    if (highlightRef.current) {
      highlightRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const renderHighlightedText = () => {
    if (!searchQuery) return <span className="text-gray-300/50 group-focus-within:text-gray-300/60 transition-colors duration-200 ease-in-out">Поиск модов...</span>;

    const parts = searchQuery.split(/(#\S+)/g);

    return parts.map((part, index) => {
      if (part.startsWith('#')) return <span key={index} className="text-amber-500">{part}</span>;
      return <span key={index}>{part}</span>;
    });
  };

  const layoutClasses = "w-107 pl-9 pr-10 py-2.5 rounded-lg text-base leading-normal whitespace-pre overflow-hidden";

  return (
    <div id="mods-search" className="relative group w-107">
      <div ref={highlightRef} className={` ${layoutClasses} absolute flex inset-0  items-center bg-gray-700 text-white border border-gray-600 group-focus-within:border-blue-500 transition-all duration-200 ease-in-out pointer-events-none`}>
        {renderHighlightedText()}
      </div>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onScroll={handleScroll}
        spellCheck="false"
        className={`${layoutClasses} relative h-full bg-transparent text-transparent caret-white outline-none border border-transparent transition-all duration-200 ease-in-out`}
      />
      <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-all duration-200 ease-in-out z-10 pointer-events-none"/>

      {searchQuery && (
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-gray-100 transition-all duration-200 ease-in-out cursor-pointer z-10"
                onClick={() => setSearchQuery('')}
        >
          <Close size={20}/>
        </button>
      )}
    </div>
  );
}

interface FilterDropdownWrapperProps {
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  checkedCount: number;
}

function FilterDropdownWrapper({activeFilter, setActiveFilter, checkedCount}: FilterDropdownWrapperProps) {
  return (
    <div id="mods-filter" className="relative flex flex-col gap-2">
      <FilterDropdown activeFilter={activeFilter} setActiveFilter={setActiveFilter} checkedCount={checkedCount}/>
    </div>
  );
}

interface ActionButtonProps {
  id?: string;
  onClick: () => void;
  className: string;
  label: string;
}

function ActionButton({ id, onClick, className, label }: ActionButtonProps) {
  return <button id={id} onClick={onClick} className={className}>{label}</button>;
}