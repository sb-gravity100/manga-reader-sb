import { Doujin, Image, Tag } from 'nhentai';
export interface Manga extends Doujin {
    availableOffline?: boolean;
}
export interface MangaData extends Image {
}
export interface MangaTag extends Tag {
}
export { SearchResult, SortMethods } from 'nhentai';
