import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { InMemoryCache, ApolloClient, gql } from '@apollo/client';

const client = new ApolloClient({
  cache: new InMemoryCache(),

  uri: ''
});

client.query({
  query: gql`
  query getTodos{
    todos{
      done 
      id
      text
    }
  }
  `
}).then(data => console.log(data));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);

