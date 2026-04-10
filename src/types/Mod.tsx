import EPMod, {Priority, Status, Category} from "@/types/EPMod.tsx";

const CATEGORY_DISPLAY_NAMES: Record<Category, string> = {
  optimization: "Оптимизация",
  visual: "Визуал",
  utility: "Утилиты",
  library: "Библиотека",
  gameplay: "Геймплей",
  audio: "Аудио"
} as const;

const PRIORITY_DISPLAY_NAMES: Record<Priority, string> = {
  required: "Обязательный",
  recommended: "Рекомендуемый",
  optional: "Опциональный"
} as const;

const STATUS_DISPLAY_NAMES: Record<Status, string> = {
  stable: "Доступен",
  broken: "Имеет баги",
  unavailable: "Недоступен"
} as const;

const STATUS_COLORS: Record<Status, string> = {
  stable: "text-green-400",
  broken: "text-yellow-400",
  unavailable: "text-red-400"
} as const;

const PRIORITY_COLORS: Record<Priority, string> = {
  required: "bg-blue-500/50 border border-blue-500/55",
  recommended: "bg-green-500/50 border border-green-500/55",
  optional: "bg-purple-500/50 border border-purple-500/55"
} as const;

export interface ModData extends Omit<EPMod, 'dependencies'> {
  size: number;
  dependencies: Mod[];
}

export default class Mod implements ModData {
  id!: string;
  name!: string;
  description!: string;
  size!: number;
  meta!: {
    priority: Priority;
    status: Status;
    hidden: boolean;
  };
  categorization!: {
    primary_category: Category;
    tags: string[];
  };
  links!: {
    icon: string;
    site: string;
    download: string;
  };
  dependencies!: Mod[];

  private constructor(data: ModData) {
    Object.assign(this, data);
  }

  static from(data: ModData): Mod {
    return new Mod(data);
  }

  static fromArray(dataArray: ModData[]): Mod[] {
    return dataArray.map(data => Mod.from(data));
  }

  get isRequired(): boolean {
    return this.meta.priority === "required";
  }

  get isRecommended(): boolean {
    return this.meta.priority === "recommended";
  }

  get isOptional(): boolean {
    return this.meta.priority === "optional";
  }

  get isLibrary(): boolean {
    return this.categorization.primary_category === "library";
  }

  get isBroken(): boolean {
    return this.meta.status === "broken";
  }

  get isStable(): boolean {
    return this.meta.status === "stable";
  }

  get isHidden(): boolean {
    return this.meta.hidden;
  }

  get isVisible(): boolean {
    return !this.meta.hidden;
  }

  get isAvailable(): boolean {
    return this.meta.status !== "unavailable";
  }

  get categoryDisplayName(): string {
    return CATEGORY_DISPLAY_NAMES[this.categorization.primary_category] || this.categorization.primary_category;
  }

  get priorityDisplayName(): string {
    return PRIORITY_DISPLAY_NAMES[this.meta.priority];
  }

  get statusDisplayName(): string {
    return STATUS_DISPLAY_NAMES[this.meta.status];
  }

  get statusColor(): string {
    return STATUS_COLORS[this.meta.status];
  }

  get priorityColor(): string {
    return PRIORITY_COLORS[this.meta.priority];
  }

  get formattedSize(): string {
    return `${this.size.toFixed(2)} МБ`;
  }

  get hasDependencies(): boolean {
    return this.dependenciesCount > 0;
  }

  get totalSize(): number {
    if (this.dependenciesCount === 0) {
      return this.size;
    }
    const depsSize = this.dependencies.reduce((sum, dep) => sum + dep.totalSize, 0);
    return this.size + depsSize;
  }

  get dependenciesCount(): number {
    return this.dependencies.length;
  }

  isDependencyOf(mod: Mod): boolean {
    return mod.dependencies?.some(dep => dep.id === this.id) ?? false;
  }

  getAllDependencies(): Mod[] {
    if (this.dependenciesCount === 0) return [];

    const deps: Mod[] = [...this.dependencies];
    this.dependencies.forEach(dep => {
      deps.push(...dep.getAllDependencies());
    });
    return deps;
  }

  hasTag(tag: string): boolean {
    return this.categorization.tags.includes(tag);
  }

  isCategory(category: Category): boolean {
    return this.categorization.primary_category === category;
  }
}
