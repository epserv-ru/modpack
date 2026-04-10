export type VersionStatus = "experimental" | "supportedAndRecommended" | "outdated" | "comingSoon" | "supportedButNotRecommended"

interface VersionData {
  version: string;
  status: VersionStatus;
}

export default class MinecraftVersion implements VersionData {
  version!: string;
  status!: VersionStatus;

  static from(data: any): MinecraftVersion {
    const instance = new MinecraftVersion();
    instance.version = data.version;
    instance.status = data.status;
    return instance;
  }

  get isExperimental(): boolean {
    return this.status === "experimental";
  }

  get isSupportedAndRecommended(): boolean {
    return this.status === "supportedAndRecommended";
  }

  get isOutdated(): boolean {
    return this.status === "outdated";
  }

  get isComingSoon(): boolean {
    return this.status === "comingSoon";
  }

  get isSupportedButNotRecommended(): boolean {
    return this.status === "supportedButNotRecommended";
  }
}