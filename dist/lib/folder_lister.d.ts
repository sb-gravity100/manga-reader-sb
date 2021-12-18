import { Manga, MangaData } from '../types';
export declare function dirSync(): Promise<Manga[]>;
export declare function mangaData(manga: Manga): Promise<{
    name: string;
    path: string;
}[] | (MangaData | undefined)[]>;
export declare function updateCovers(): Promise<void>;
