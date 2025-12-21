export default interface EPMod {
  id: string;
  name: string;
  purpose: string;
  description: string;
  size: number;
  icon_url: string;
  site_link: string;
  required: boolean;
  recommended: boolean;
  library: boolean;
  broken: boolean;
  download_link: string;
  dependencies?: string[];
}