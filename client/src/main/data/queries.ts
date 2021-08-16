import { gql } from '@apollo/client'

export const GET_MANGAS = gql`
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
`
export const GET_MANGA = gql`
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
`

export const SEARCH_MANGA = gql`
query SearchManga($s: String){
  search(term: $s) {
    id
    name
    cover
  }
}
`

export const UPDATE_COVERS = gql`
query {
  update
}
`
