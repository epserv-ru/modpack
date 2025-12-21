'use client';

import { useMemo } from "react";
import Mod from "@/types/Mod";
import { FilterType } from "@/components/select-mods/FilterDropdown";

/**
 * Хук для фильтрации и сортировки модов
 * @param mods - Список всех модов
 * @param searchQuery - Поисковый запрос
 * @param activeFilter - Активный фильтр
 * @param checkedMods - Выбранные моды
 * @returns Отфильтрованный и отсортированный список модов
 */
export function useModFilters(
  mods: Mod[],
  searchQuery: string,
  activeFilter: FilterType,
  checkedMods: Mod[]
) {
  return useMemo(() => {
    const searchLower = searchQuery.toLowerCase();

    return mods
      .filter(mod => {
        const matchesSearch = searchQuery === '' ||
          mod.name.toLowerCase().includes(searchLower) ||
          mod.description.toLowerCase().includes(searchLower);
        switch (activeFilter) {
          case FilterType.LIBRARY:
            return matchesSearch && mod.library;
          case FilterType.REQUIRED:
            return matchesSearch && mod.required;
          case FilterType.RECOMMENDED:
            return matchesSearch && mod.recommended && !mod.required && !mod.library;
          case FilterType.OPTIONAL:
            return matchesSearch && !mod.required && !mod.library;
          case FilterType.SELECTED:
            return matchesSearch && checkedMods.some(m => m.id === mod.id);
          default:
            return matchesSearch;
        }
      })
      .sort((a, b) => {
        if (a.library !== b.library) return a.library ? 1 : -1;
        return a.name.localeCompare(b.name);
      });
  }, [mods, searchQuery, activeFilter, checkedMods]);
}
