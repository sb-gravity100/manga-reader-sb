import { Manga, MangaData } from '../../../src/types';

export interface MangaHeaderProps {
   manga?: Manga;
   zoomValue?: number;
   brightVal?: number;
}

export interface ReaderItemProps {
   item: Manga;
}

export interface MangaViewProps {
   img: MangaData;
   src: string;
}

export interface ReaderProps {
   total?: number;
   data?: Manga[];
   loading: boolean;
   refetch(...args: any[]): void;
}

export interface ErrorProps {
   hasErrors: boolean;
   errors?: any;
   retry: () => void;
   isFetching: boolean;
}

export interface NavProps {
   refetch: ReaderProps['refetch'];
}

export interface SearchBarProps {}

export function getSearchParams(p: URLSearchParams) {
   var keys = {} as any;
   p.forEach((v, k) => {
      keys[k] = v;
   });
   return keys;
}

export const Locales = {
   JAPANESE: '/japan_logo.svg',
   CHINESE: '/china_logo.svg',
   ENGLISH: '/us_logo.svg',
};

export function getLocale(name: string) {
   return (Locales as any)[name.toUpperCase()];
}
