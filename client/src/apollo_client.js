import { ApolloClient, InMemoryCache } from '@apollo/client'

const apollo_client = new ApolloClient({
   uri: '/api/ql',
   cache: new InMemoryCache(),
});

export default apollo_client
