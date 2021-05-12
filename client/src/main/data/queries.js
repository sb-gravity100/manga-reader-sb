import { gql } from '@apollo/client'

export const GET_MANGAS = gql`
query AllMangas($all: Boolean = false) {
  list: mangas {
    id
    name
    pathname @include(if: $all)
    createdAt
    size
    data @include(if: $all) {
      name
      path
    }
  }
}
`
export const GET_MANGA = gql`
query getManga($id: ID!, $all: Boolean = false) {
   manga(id: $id) {
      id
      name
      pathname @include(if: $all)
      createdAt
      size
      data {
         name
         path
      }
   }
}
`
