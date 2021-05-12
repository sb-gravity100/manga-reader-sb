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
   mangas(sort: String = "createAt"): [Manga!]
   manga(id: ID!): Manga
}

type Manga {
   id: ID!
   name: String!
   pathname: String!
   createdAt: DateTime!
   size: Int!
   data: [MangaData!]
}

type MangaData {
   name: String!
   path: String!
}
`
