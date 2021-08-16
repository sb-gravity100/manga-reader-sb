import { ApolloError } from '@apollo/client';

export interface MangaHeaderProps {
   manga: any;
   zoomValue: any;
   brightVal: any;
   setBright: any;
   setZoomVal: any;
}

export interface ReaderProps {
   total: number;
   data: any[];
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
