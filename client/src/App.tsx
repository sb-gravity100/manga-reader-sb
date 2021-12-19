import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import { FaAngleUp } from 'react-icons/fa';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Main from './components/Main';
import Manga from './components/Manga';
import NotFound from './components/sub-components/404';
import './stylesheets/App.scss';

const ToTopComponent: React.FC = () => {
   const location = useLocation();
   const nav = useNavigate();
   return (
      <ButtonGroup
         vertical
         style={{ right: '2rem', bottom: '3rem', position: 'fixed' }}
      >
         <>
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
            <Button variant="secondary" onClick={() => nav('/')}>
               Go Back
            </Button>
         </>
      </ButtonGroup>
   );
};

const App = () => {
   return (
      <Routes>
         <Route path="/" caseSensitive element={<Main />} />
         <Route path="manga">
            <Route
               path=":id"
               element={
                  <>
                     <Manga />
                     <ToTopComponent />
                  </>
               }
            />
         </Route>
         <Route path="online" />
         <Route path="*" element={<NotFound />} />
      </Routes>
   );
};

export default App;
