import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import _ from 'lodash';
import { Manga, SearchResult } from '../../../src/types';

interface MangasQuery {
   offset?: number;
   limit?: number;
   order?: any;
   sort?: string | string[];
   refresh?: any;
   _updateCovers?: any;
   page?: number;
}

const ApiSlice = createApi({
   reducerPath: 'mangaApi',
   baseQuery: fetchBaseQuery({
      baseUrl: '/api',
   }),
   endpoints: builder => ({
      allMangas: builder.query<Manga[], MangasQuery | null>({
         query(opts) {
            const query = new URLSearchParams();
            _.toPairs(opts as any).forEach(e => {
               query.append(e[0], e[1] as string);
            });
            return `/mangas?${query.toString()}`;
         },
      }),
      getManga: builder.query<Manga, number>({
         query(id) {
            return `/manga/${id}`;
         },
      }),
      search: builder.query<SearchResult[], string>({
         query(q) {
            return `/?q=${q}`
         }
      })
   }),
   
});

export default ApiSlice

export const { useAllMangasQuery, useGetMangaQuery, useLazySearchQuery } = ApiSlice
