import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import _ from 'lodash';
import { Doujin } from 'nhentai';
import { Manga, SearchResult, SortMethods } from '../../../src/types';

interface SearchQuery {
   q: string;
   page?: any;
   sort?: SortMethods;
}

interface HomepageQuery extends Omit<SearchQuery, 'q'> {}

const ApiSlice = createApi({
   reducerPath: 'HentaiApi',
   baseQuery: fetchBaseQuery({
      baseUrl: '/api/onlineapi',
   }),
   endpoints: (builder) => ({
      getDoujin: builder.query<Manga, number | string>({
         query(id) {
            return {
               url: `/doujin`,
               params: {
                  id,
               },
            };
         },
      }),
      search: builder.query<SearchResult, SearchQuery | string>({
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
      getHomepage: builder.query<SearchResult, HomepageQuery | void>({
         query(q) {
            return {
               url: '/homepage',
               params: q as any,
            };
         },
      }),
   }),
});

export default ApiSlice;

export const {
   useGetHomepageQuery,
   useGetDoujinQuery,
   useLazyGetHomepageQuery,
   useLazyGetDoujinQuery,
   useLazySearchQuery,
   usePrefetch,
   useSearchQuery,
} = ApiSlice;
