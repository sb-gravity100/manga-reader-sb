import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Main from './components/Main';
import Manga from './components/Manga';
import NotFound from './components/sub-components/404';
import './stylesheets/App.scss';

const App = () => {
   return (
      <Routes>
         <Route path="/" element={<Main />}></Route>
         <Route path="/manga" element={<Manga />} />
         <Route path="*" element={<NotFound />} />
      </Routes>
   );
};

export default App;
