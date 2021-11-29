import 'intersection-observer';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
   BrowserRouter as Router,
   useLocation,
   useNavigate,
} from 'react-router-dom';
import store from './store';
import { FaAngleUp } from 'react-icons/fa';
import { createBrowserHistory } from 'history';
import App from './App';
import './stylesheets/index.scss';
import { ButtonGroup, Button } from 'react-bootstrap';

const ToTopComponent: React.FC = () => {
   const location = useLocation();
   const nav = useNavigate();
   return (
      <ButtonGroup
         vertical
         style={{ right: '2rem', bottom: '3rem', position: 'fixed' }}
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
            <Button variant="secondary" onClick={() => nav('/')}>
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
      </Provider>
   </Router>,
   document.querySelector('#container')
);
