import { Manga } from '../types';
export declare function dirSync(): {
    id: string;
    name: string;
    pathname: string;
    createdAt: any;
    size: number;
    data?: import("../types").MangaData[];
    cover?: string;
}[];
export declare function mangaData(manga: Manga): {
    name: string;
    path: any;
}[];
export declare function updateCovers(): Promise<void>;
