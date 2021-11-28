import 'intersection-observer';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import store from './store';
import { FaAngleUp } from 'react-icons/fa';
import { createBrowserHistory } from 'history';
import App from './App';
import styles from './style.module.scss';
import './stylesheets/index.scss';
import Footer from './Footer';
import { ButtonGroup, Button } from 'react-bootstrap';
import classNames from 'classnames';

const ToTopComponent: React.FC = () => {
   const location = useLocation();
   const history = createBrowserHistory();
   return (
      <ButtonGroup
         vertical
         style={{ right: '1rem', bottom: '3rem' }}
         className="position-fixed"
      >
         <Button
            onClick={() =>
               window.scroll({
                  behavior: 'smooth',
                  top: 0,
                  left: 0,
               })
            }
         >
            <FaAngleUp fontSize="3rem" />
         </Button>
         {location.pathname.trim() !== '/' && (
            <Button variant="secondary" onClick={() => history.back()}>
               Go Back
            </Button>
         )}
      </ButtonGroup>
   );
};

ReactDOM.render(
   <Router>
      <Provider store={store}>
         <App />
         <ToTopComponent />
         <Footer />
      </Provider>
   </Router>,
   document.querySelector('#container')
);
