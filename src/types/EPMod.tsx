export type Category = "optimization" | "visual" | "utility" | "library" | "gameplay" | "audio";
export type Priority = "required" | "recommended" | "optional";
export type Status = "stable" | "broken" | "unavailable";

interface EpModData {
  id: string;
  name: string;
  description: string;

  meta: {
    priority: Priority;
    status: Status;
    hidden: boolean;
  };

  categorization: {
    primary_category: Category;
    tags: string[];
  };

  links: {
    icon: string;
    site: string;
    download: string;
  };

  dependencies: string[];
}

export default class EPMod implements EpModData {
  id!: string;
  name!: string;
  description!: string;

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

  dependencies!: string[];

  static from(data: any): EPMod {
    const instance = new EPMod();
    instance.id = data.id;
    instance.name = data.name;
    instance.description = data.description;
    instance.meta = data.meta;
    instance.categorization = data.categorization;
    instance.links = data.links;
    instance.dependencies = data.dependencies;
    return instance;
  }
}