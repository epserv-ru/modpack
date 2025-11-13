export default interface EPMod {
    id: string;
    name: string;
    description: string;
    sizes: string;
    icon_url: string;
    link_api: string;
    site_link: string;
    required: boolean;
    library: boolean;
    broken: boolean;
    download_link: string;
    dependencies: string[]
}