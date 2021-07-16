const { gql } = require('apollo-server-express');
const { GraphQLDateTime } = require('graphql-scalars');

const scalars = {
   DateTime: GraphQLDateTime
}

module.exports.resolvers = {
   ...scalars,
   ...require('./resolvers')
}

module.exports.typeDefs = gql`
scalar DateTime

schema {
   query: Query
}

type Query {
   mangas(sort: String = "createAt asc", limit: Int, cursor: Int = 0, refresh: Boolean = false): [Manga!]
   manga(id: ID!): Manga
   search(term: String): [Manga!]
   total: Int!
   update: Boolean
}

type Manga {
   id: ID!
   name: String!
   pathname: String!
   createdAt: DateTime!
   size: Int!
   data: [MangaData!]
   cover: String
}

type MangaData {
   name: String!
   path: String!
}
`
