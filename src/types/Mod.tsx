export default interface Mod {
  id: string;
  name: string;
  purpose: string;
  description: string;
  size: number;
  icon_url: string;
  site: string;
  required: boolean;
  recommended: boolean;
  library: boolean;
  broken: boolean;
  available: boolean;
  reliable_link: string | null;
  dependencies?: Mod[] | null;
}