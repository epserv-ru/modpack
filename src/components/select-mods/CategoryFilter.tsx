'use client';

import { Category } from "@/types/EPMod";

interface CategoryFilterProps {
  selectedCategories: Category[];
  onToggleCategory: (category: Category) => void;
}

const CATEGORIES: Record<Category, string> = {
  optimization: "Оптимизация",
  visual: "Визуал",
  utility: "Утилиты",
  library: "Библиотеки",
  gameplay: "Геймплей",
  audio: "Аудио"
};

export default  function CategoryFilter({ selectedCategories, onToggleCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-row flex-wrap gap-2">
      {Object.entries(CATEGORIES).map(([key, name]) => {
        if (key !== "library") {
          const category = key as Category;
          const isActive = selectedCategories.includes(category);
          return (
            <button
              key={category}
              onClick={() => onToggleCategory(category)}
              className={`px-3 py-1 rounded-lg text-sl font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white ${isActive ? "bg-green-700 text-white hover:bg-green-800" : ""} transition-all duration-200 ease-in-out cursor-pointer`}
            >
              {name}
            </button>
          );
        }
      })}
    </div>
  );
}
