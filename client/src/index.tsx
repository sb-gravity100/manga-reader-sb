import 'intersection-observer';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './store';
import App from './App';
import './stylesheets/index.scss';
import { IconContext } from 'react-icons/lib';

ReactDOM.render(
   <Provider store={store}>
      <Router>
         <IconContext.Provider
            value={{
               className: 'r-icon',
            }}
         >
            <App />
         </IconContext.Provider>
      </Router>
   </Provider>,
   document.querySelector('#container')
);
