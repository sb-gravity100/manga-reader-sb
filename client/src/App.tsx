import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Main from './components/Main';
import Manga from './components/Manga';
import NotFound from './components/sub-components/404';
import './stylesheets/App.scss';

const App = () => (
   <Switch>
      <Route exact path="/" component={Main} />
      <Route path="/manga" component={Manga} />
      <Route component={NotFound} />
   </Switch>
);

export default App;
