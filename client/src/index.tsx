import 'intersection-observer';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './store';
import { FaChevronUp } from 'react-icons/fa';
import App from './App';
import styles from './style.module.scss';
import './stylesheets/index.scss';
import Footer from './Footer';

const ToTopComponent: React.FC = () => {
  return (
    <button
      className={styles.TopComponent}
      onClick={() =>
        window.scroll({
          behavior: 'smooth',
          top: 0,
          left: 0,
        })
      }>
      <FaChevronUp fontSize="2rem" />
    </button>
  );
};

ReactDOM.render(
  <>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
      <ToTopComponent />
      <Footer />
    </Provider>
  </>,
  document.querySelector('#container')
);
