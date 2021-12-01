import 'intersection-observer';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './store';
import App from './App';
import './stylesheets/index.scss';

ReactDOM.render(
   <Router>
      <Provider store={store}>
         <App />
      </Provider>
   </Router>,
   document.querySelector('#container')
);
