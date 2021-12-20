import 'intersection-observer';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './store';
import App from './App';
import './stylesheets/index.scss';
import ToastArea from './components/online/ToastArea';

ReactDOM.render(
   <Provider store={store}>
      <ToastArea />
      <Router>
         <App />
      </Router>
   </Provider>,
   document.querySelector('#container')
);
