import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { FaChevronUp } from 'react-icons/fa';
import App from './main/App';
import styles from './main/css_modules/TopComponent.module.scss'
import './stylesheets/index.scss';
import Footer from './main/Footer';

const apollo_client = new ApolloClient({
  uri: '/api/ql',
  cache: new InMemoryCache(),
});

const ToTopComponent = () => {
  return (
    <button className={styles.TopComponent} onClick={() => window.scroll({
      behavior: 'smooth',
      top: 0,
      left: 0,
    })} >
      <FaChevronUp fontSize="2rem" />
    </button>
  );
};

ReactDOM.render(
  <>
    <Router>
      <ApolloProvider client={apollo_client}>
        <App />
      </ApolloProvider>
    </Router>
    <ToTopComponent />
    <Footer />
  </>,
  document.querySelector('#container')
);
