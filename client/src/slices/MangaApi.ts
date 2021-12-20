import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import _ from 'lodash';
import { Doujin } from 'nhentai';
import { Manga, SearchResult } from '../../../src/types';

interface MangasQuery {
   limit?: any;
   page?: any;
}

interface SearchQuery {
   q: string;
   by?: 'artist' | 'tag' | 'language' | 'category' | 'parody';
}

const ApiSlice = createApi({
   reducerPath: 'MangaApi',
   baseQuery: fetchBaseQuery({
      baseUrl: '/api',
   }),
   endpoints: (builder) => ({
      allMangas: builder.query<SearchResult, MangasQuery | void>({
         query(opts) {
            return {
               url: '/mangas',
               params: opts as any,
            };
         },
      }),
      getManga: builder.query<Manga, number | string>({
         query(id) {
            return {
               url: `/doujin`,
               params: {
                  id,
               },
            };
         },
      }),
      search: builder.query<Manga[], SearchQuery | string>({
         query(q) {
            return {
               url: '/search',
               params:
                  typeof q === 'string'
                     ? {
                          q,
                       }
                     : q,
            };
         },
      }),
      saveManga: builder.query<Manga, string>({
         query(id) {
            return {
               url: '/save',
               params: {
                  id,
               },
            };
         },
      }),
      removeManga: builder.query<number, string>({
         query(id) {
            return {
               url: '/remove',
               params: {
                  id,
               },
            };
         },
      }),
   }),
});

export default ApiSlice;

export const {
   useAllMangasQuery,
   useGetMangaQuery,
   useLazySearchQuery,
   useSearchQuery,
   useLazyAllMangasQuery,
   useLazyGetMangaQuery,
   usePrefetch,
   useLazySaveMangaQuery,
   useSaveMangaQuery,
   useLazyRemoveMangaQuery,
   useRemoveMangaQuery,
} = ApiSlice;
