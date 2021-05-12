import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './main/App';
import './stylesheets/index.scss';
import Footer from './main/Footer';

const apollo_client = new ApolloClient({
   uri: '/api/ql',
   cache: new InMemoryCache(),
   name: 'MangaQL'
});

ReactDOM.render(
   <React.StrictMode>
      <Router>
         <ApolloProvider client={apollo_client} >
            <App />
         </ApolloProvider>
      </Router>
      <Footer />
   </React.StrictMode>,
   document.querySelector('#container')
);
