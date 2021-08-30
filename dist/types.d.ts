import Fuse from 'fuse.js';
export interface Manga {
    id?: string | number;
    name: string;
    pathname: string;
    createdAt: Date;
    size: number;
    data?: Array<MangaData>;
    cover?: string;
}
export interface MangaData {
    name: string;
    path: string;
}
export declare type SearchResult = Fuse.FuseResult<Manga>;
export declare type MangasResult = {
    items: Manga[];
    total: number;
} & Record<'last' | 'first' | 'next' | 'prev', {
    limit: number;
    page: number;
}>;
