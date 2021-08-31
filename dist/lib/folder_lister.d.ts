import { Manga, MangaData } from '../types';
export declare function dirSync(): Promise<Manga[]>;
export declare function mangaData(manga: Manga): Promise<(MangaData | undefined)[]>;
export declare function updateCovers(): Promise<void>;
