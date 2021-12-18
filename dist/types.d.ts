import type { APIDoujin, APIImage, APITag } from 'nhentai';
export interface Manga extends APIDoujin {
}
export interface MangaData extends APIImage {
}
export interface MangaTag extends APITag {
}
export type { SearchResult } from 'nhentai';
