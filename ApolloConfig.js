import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://5.182.33.47:4000/graphql',
  cache: new InMemoryCache()
});