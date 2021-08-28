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
   panelImg: MangaData;
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
   isCurrent(i: number): boolean;
   chunks: Manga[][];
   p_index: string | null;
}

export interface SearchBarProps {}
