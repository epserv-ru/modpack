'use client';

import { useMemo } from "react";
import Mod from "@/types/Mod";
import { FilterType } from "@/components/select-mods/FilterDropdown";
import { Category } from "@/types/EPMod";

/**
 * Хук для фильтрации и сортировки модов
 * @param mods - Список всех модов
 * @param searchQuery - Поисковый запрос
 * @param activeFilter - Активный фильтр по приоритету
 * @param checkedMods - Выбранные моды
 * @param selectedCategories - Выбранные категории (если массив пуст - показывать все)
 * @returns Отфильтрованный и отсортированный список модов
 */
export function useModFilters(
  mods: Mod[],
  searchQuery: string,
  activeFilter: FilterType,
  checkedMods: Mod[],
  selectedCategories: Category[] = []
) {
  return useMemo(() => {
    const searchLower = searchQuery.toLowerCase().trim();

    const tagRegex = /#(\S+)/g;
    const tagSearchParts = searchLower.match(tagRegex)?.map(tag => tag.substring(1)) || [];
    const hasTagSearch = tagSearchParts.length > 0;

    const regularSearchQuery = hasTagSearch ? searchLower.replace(tagRegex, '').trim() : searchLower;

    return mods
      .filter(mod => !mod.isHidden)
      .filter(mod => !mod.isLibrary)
      .filter(mod => {
        let matchesTags = true;
        if (hasTagSearch) {
          matchesTags = tagSearchParts.some(searchTag =>
            mod.categorization.tags.some(modTag =>
              modTag.toLowerCase().startsWith(searchTag)
            )
          );
        }

        let matchesSearch = true;
        if (regularSearchQuery !== '') {
          matchesSearch = mod.name.toLowerCase().includes(regularSearchQuery) ||
            mod.description.toLowerCase().includes(regularSearchQuery);
        }

        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(mod.categorization.primary_category);

        switch (activeFilter) {
          case FilterType.SELECTED:
            if (!checkedMods.some(m => m.id === mod.id)) return false;
            break;
          case FilterType.REQUIRED:
            if (!mod.isRequired) return false;
            break;
          case FilterType.RECOMMENDED:
            if (!mod.isRecommended) return false;
            break;
          case FilterType.OPTIONAL:
            if (!mod.isOptional) return false;
            break;
        }

        return matchesTags && matchesSearch && matchesCategory;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [mods, searchQuery, activeFilter, checkedMods, selectedCategories]);
}
