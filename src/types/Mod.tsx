export default interface Mod {
    id: string;
    name: string;
    description: string;
    size: number;
    icon_url: string;
    site: string;
    required: boolean;
    library: boolean;
    broken: boolean;
    available: boolean;
    reliable_link: string;
    dependencies: Mod[]
}