declare module "database" {
    import Datastore from 'nedb-promises';
    const db: Datastore;
    export default db;
}
declare module "types" {
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
    } & Record<'next' | 'prev' | 'total' | 'limit', number>;
}
declare module "lib/folder_lister" {
    import { Manga, MangaData } from "types";
    export function dirSync(): Promise<Manga[]>;
    export function mangaData(manga: Manga): Promise<(MangaData | undefined)[]>;
    export function updateCovers(): Promise<void>;
}
declare module "api.route" {
    const route: import("express-serve-static-core").Router;
    export default route;
}
declare module "server" { }
declare module "lib/renamer" { }
