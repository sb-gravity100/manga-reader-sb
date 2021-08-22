import { ApolloError } from '@apollo/client';
import { Dispatch, SetStateAction } from 'react';
import { Manga, MangaData } from '../../types';

export interface MangaHeaderProps {
   manga?: Manga;
   zoomValue?: number;
   brightVal?: number;
   setBright: Dispatch<SetStateAction<number | undefined>>;
   setZoomVal: Dispatch<SetStateAction<number | undefined>>;
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
   errors?: ApolloError;
   retry: () => void;
   loading: boolean;
   status?: number;
}
