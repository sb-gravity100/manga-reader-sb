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

export type SearchResult = Fuse.FuseResult<Manga>;

export type MangasResult = {
   items: Manga[];
   first: number;
   last: number;
} & Record<'next' | 'prev' | 'total' | 'limit' | 'current', number>;
