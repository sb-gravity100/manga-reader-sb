import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};


export type Manga = {
  id: Scalars['ID'];
  name: Scalars['String'];
  pathname: Scalars['String'];
  createdAt: Scalars['DateTime'];
  size: Scalars['Int'];
  data?: Maybe<Array<MangaData>>;
  cover?: Maybe<Scalars['String']>;
};

export type MangaData = {
  name: Scalars['String'];
  path: Scalars['String'];
};

export type Query = {
  mangas?: Maybe<Array<Manga>>;
  manga?: Maybe<Manga>;
  search?: Maybe<Array<Manga>>;
  total: Scalars['Int'];
  update?: Maybe<Scalars['Boolean']>;
};


export type QueryMangasArgs = {
  sort?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  cursor?: Maybe<Scalars['Int']>;
  refresh?: Maybe<Scalars['Boolean']>;
};


export type QueryMangaArgs = {
  id: Scalars['ID'];
};


export type QuerySearchArgs = {
  term?: Maybe<Scalars['String']>;
};

export type AllMangasQueryVariables = Exact<{
  refresh?: Maybe<Scalars['Boolean']>;
  slice?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
}>;


export type AllMangasQuery = { total: number, list?: Maybe<Array<{ id: string, name: string, pathname: string, createdAt: any, size: number, cover?: Maybe<string> }>> };

export type GetMangaQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetMangaQuery = { manga?: Maybe<{ id: string, name: string, pathname: string, createdAt: any, size: number, data?: Maybe<Array<{ name: string, path: string }>> }> };

export type SearchMangaQueryVariables = Exact<{
  s?: Maybe<Scalars['String']>;
}>;


export type SearchMangaQuery = { search?: Maybe<Array<{ id: string, name: string, cover?: Maybe<string> }>> };

export type UpdateDataQueryVariables = Exact<{ [key: string]: never; }>;


export type UpdateDataQuery = { update?: Maybe<boolean> };


export const AllMangasDocument = gql`
    query AllMangas($refresh: Boolean, $slice: Int, $limit: Int) {
  list: mangas(refresh: $refresh, cursor: $slice, limit: $limit) {
    id
    name
    pathname
    createdAt
    size
    cover
  }
  total
}
    `;

/**
 * __useAllMangasQuery__
 *
 * To run a query within a React component, call `useAllMangasQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllMangasQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllMangasQuery({
 *   variables: {
 *      refresh: // value for 'refresh'
 *      slice: // value for 'slice'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useAllMangasQuery(baseOptions?: Apollo.QueryHookOptions<AllMangasQuery, AllMangasQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllMangasQuery, AllMangasQueryVariables>(AllMangasDocument, options);
      }
export function useAllMangasLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllMangasQuery, AllMangasQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllMangasQuery, AllMangasQueryVariables>(AllMangasDocument, options);
        }
export type AllMangasQueryHookResult = ReturnType<typeof useAllMangasQuery>;
export type AllMangasLazyQueryHookResult = ReturnType<typeof useAllMangasLazyQuery>;
export type AllMangasQueryResult = Apollo.QueryResult<AllMangasQuery, AllMangasQueryVariables>;
export const GetMangaDocument = gql`
    query getManga($id: ID!) {
  manga(id: $id) {
    id
    name
    pathname
    createdAt
    size
    data {
      name
      path
    }
  }
}
    `;

/**
 * __useGetMangaQuery__
 *
 * To run a query within a React component, call `useGetMangaQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMangaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMangaQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetMangaQuery(baseOptions: Apollo.QueryHookOptions<GetMangaQuery, GetMangaQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMangaQuery, GetMangaQueryVariables>(GetMangaDocument, options);
      }
export function useGetMangaLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMangaQuery, GetMangaQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMangaQuery, GetMangaQueryVariables>(GetMangaDocument, options);
        }
export type GetMangaQueryHookResult = ReturnType<typeof useGetMangaQuery>;
export type GetMangaLazyQueryHookResult = ReturnType<typeof useGetMangaLazyQuery>;
export type GetMangaQueryResult = Apollo.QueryResult<GetMangaQuery, GetMangaQueryVariables>;
export const SearchMangaDocument = gql`
    query SearchManga($s: String) {
  search(term: $s) {
    id
    name
    cover
  }
}
    `;

/**
 * __useSearchMangaQuery__
 *
 * To run a query within a React component, call `useSearchMangaQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchMangaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchMangaQuery({
 *   variables: {
 *      s: // value for 's'
 *   },
 * });
 */
export function useSearchMangaQuery(baseOptions?: Apollo.QueryHookOptions<SearchMangaQuery, SearchMangaQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchMangaQuery, SearchMangaQueryVariables>(SearchMangaDocument, options);
      }
export function useSearchMangaLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchMangaQuery, SearchMangaQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchMangaQuery, SearchMangaQueryVariables>(SearchMangaDocument, options);
        }
export type SearchMangaQueryHookResult = ReturnType<typeof useSearchMangaQuery>;
export type SearchMangaLazyQueryHookResult = ReturnType<typeof useSearchMangaLazyQuery>;
export type SearchMangaQueryResult = Apollo.QueryResult<SearchMangaQuery, SearchMangaQueryVariables>;
export const UpdateDataDocument = gql`
    query updateData {
  update
}
    `;

/**
 * __useUpdateDataQuery__
 *
 * To run a query within a React component, call `useUpdateDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useUpdateDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUpdateDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useUpdateDataQuery(baseOptions?: Apollo.QueryHookOptions<UpdateDataQuery, UpdateDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UpdateDataQuery, UpdateDataQueryVariables>(UpdateDataDocument, options);
      }
export function useUpdateDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UpdateDataQuery, UpdateDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UpdateDataQuery, UpdateDataQueryVariables>(UpdateDataDocument, options);
        }
export type UpdateDataQueryHookResult = ReturnType<typeof useUpdateDataQuery>;
export type UpdateDataLazyQueryHookResult = ReturnType<typeof useUpdateDataLazyQuery>;
export type UpdateDataQueryResult = Apollo.QueryResult<UpdateDataQuery, UpdateDataQueryVariables>;