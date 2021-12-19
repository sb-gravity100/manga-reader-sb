import { ChangeEventHandler, Dispatch, SetStateAction } from 'react';
import { Manga, MangaData } from '../../../src/types';
import { useSearchQuery } from '../slices/MangaApi';

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
