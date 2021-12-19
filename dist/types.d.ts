import type { Doujin, Image, Tag } from 'nhentai';
export interface Manga extends Doujin {
}
export interface MangaData extends Image {
}
export interface MangaTag extends Tag {
}
export type { SearchResult, SortMethods } from 'nhentai';
