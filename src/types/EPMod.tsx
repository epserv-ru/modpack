import StringOnVersion from "./records/StringOnVersion.tsx";

export default interface EPMod {
    id: string;
    name: string;
    description: string;
    sizes: StringOnVersion;
    icon_url: string;
    link_api: string;
    site: StringOnVersion;
    required: boolean;
    library: boolean;
    broken: boolean;
    reliable_links: StringOnVersion;
    dependencies: string[]
}