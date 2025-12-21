'use client';

import { Close, Search } from "flowbite-react-icons/outline";
import { FilterType } from "./FilterDropdown";
import FilterDropdown from "./FilterDropdown";

const CSS = {
  searchSection: "flex flex-row gap-4 items-center",
  searchInput: "pl-9 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 w-80 border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors",
};

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  checkedCount: number;
  filteredCount: number;
  onSelectAll: () => void;
  onReset: () => void;
}

export default function SearchSection({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  checkedCount,
  filteredCount,
  onSelectAll,
  onReset,
}: SearchSectionProps) {
  return (
    <div className={CSS.searchSection}>
      <SearchInput
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <FilterDropdownWrapper
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        checkedCount={checkedCount}
      />
      <ActionButton
        id="mods-select-all"
        onClick={onSelectAll}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors cursor-pointer"
        label="Выбрать все"
      />
      <ActionButton
        onClick={onReset}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors cursor-pointer"
        label="Сбросить"
      />
      <div className="text-gray-400 text-sm">
        Найдено: {filteredCount}
      </div>
    </div>
  );
}

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

function SearchInput({ searchQuery, setSearchQuery }: SearchInputProps) {
  return (
    <div id="mods-search" className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Поиск модов..."
        value={searchQuery}
        onChange={(e) => { setSearchQuery(e.target.value) }}
        className={CSS.searchInput}
      />
      {searchQuery && (
        <button
          onClick={() => { setSearchQuery('') }}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <Close size="20px" className="cursor-pointer"/>
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

function FilterDropdownWrapper({
  activeFilter,
  setActiveFilter,
  checkedCount,
}: FilterDropdownWrapperProps) {
  return (
    <div id="mods-filter">
      <FilterDropdown
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        checkedCount={checkedCount}
      />
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
  return (
    <button id={id} onClick={onClick} className={className}>
      {label}
    </button>
  );
}
