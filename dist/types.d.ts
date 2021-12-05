export interface Manga {
    id?: string | number;
    name: string;
    pathname: string;
    createdAt: Date;
    size: number;
    data?: Array<MangaData>;
    cover?: string;
    blur?: string;
}
export interface MangaData {
    name: string;
    path: string;
}
export declare type SearchResult = {
    item: Manga;
};
export declare type MangasResult = {
    items: Manga[];
    first: number;
    last: number;
} & Record<'next' | 'prev' | 'total' | 'limit' | 'current', number>;
