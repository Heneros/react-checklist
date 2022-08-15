import React from 'react';
import ReactDOM from 'react-dom/client';
import { HASURA_SECRET, HASURA_URL } from './keys';
import App from './App';


import { InMemoryCache, ApolloClient, gql } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';


const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: HASURA_URL,
  headers: {
    'x-hasura-admin-secret': HASURA_SECRET
  }
})

// client.query({
//   query: gql`
//   query getTodos{
//     todos{
//       done 
//       id
//       text
//     }
//   }
//   `
// }).then(data => console.log(data));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

