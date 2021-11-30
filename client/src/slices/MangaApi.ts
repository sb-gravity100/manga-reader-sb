import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import _ from 'lodash';
import { Manga, SearchResult, MangasResult } from '../../../src/types';

interface MangasQuery {
   offset?: number;
   limit?: number;
   order?: any;
   sort?: string | string[];
   refresh?: any;
   page?: number;
}

interface Meta {
   nextPage?: number;
   prevPage?: number;
   firstPage?: number;
   lastPage?: number;
}

const ApiSlice = createApi({
   reducerPath: 'MangaApi',
   baseQuery: fetchBaseQuery({
      baseUrl: '/api',
   }),
   endpoints: (builder) => ({
      allMangas: builder.query<MangasResult, MangasQuery | void>({
         query(opts) {
            return {
               url: '/mangas',
               params: opts || {
                  page: 0,
                  limit: 10,
               },
            };
         },
      }),
      getManga: builder.query<Manga, number>({
         query(id) {
            return {
               url: `/manga`,
               params: {
                  id,
               },
            };
         },
      }),
      search: builder.query<SearchResult[], string>({
         query(q) {
            return `/search?q=${q || ''}`;
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
} = ApiSlice;
