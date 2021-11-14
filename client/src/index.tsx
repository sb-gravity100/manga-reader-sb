import 'intersection-observer';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
   BrowserRouter as Router,
   Link,
   useLocation,
   useHistory,
} from 'react-router-dom';
import store from './store';
import { FaAngleUp } from 'react-icons/fa';
import App from './App';
import styles from './style.module.scss';
import './stylesheets/index.scss';
import Footer from './Footer';

const ToTopComponent: React.FC = () => {
   const location = useLocation();
   const history = useHistory();
   // console.log(location.pathname);
   return (
      <div className={styles.StickyBar}>
         <button
            onClick={() =>
               window.scroll({
                  behavior: 'smooth',
                  top: 0,
                  left: 0,
               })
            }
         >
            <FaAngleUp fontSize="3rem" />
         </button>
         {location.pathname.trim() !== '/' && (
            <button onClick={() => history.goBack()}>Go Back</button>
         )}
      </div>
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
