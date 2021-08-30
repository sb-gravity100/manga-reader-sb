import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSearchParam } from 'react-use';
import Main from './components/Main';
import Manga from './components/Manga';
import NotFound from './components/sub-components/404';
import { setPage } from './slices/ControlSlice';
import { useDispatch } from './store';
import './stylesheets/App.scss';

const App = () => {
   const page = useSearchParam('page');
   const dispatch = useDispatch();
   useEffect(() => {
      if (page) {
         dispatch(
            setPage({
               current: Number(page),
            })
         );
      }
   }, [page]);
   return (
      <Switch>
         <Route exact path="/" component={Main} />
         <Route path="/manga" component={Manga} />
         <Route component={NotFound} />
      </Switch>
   );
};

export default App;
