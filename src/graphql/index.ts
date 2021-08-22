import { loadSchema } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { resolvers } from './resolvers';
import path from 'path';

export default async () => {
   const schema = await loadSchema(
      path.join(process.cwd(), 'graphql/schema.graphql'),
      {
         loaders: [new GraphQLFileLoader()],
         resolvers,
      }
   );
   return schema;
};
