import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import Store from './Store'
import Hero from './containers/Hero/Hero';
import Photos from './containers/Photos/Photos';

function App() {
  return (
    <Switch>
      <Route path="/photos" render={(props) => <Store><Photos {...props}/></Store>} />
      <Route path="/" exact render={(props) => <Store><Hero {...props}/></Store>} />
      <Redirect to='/' />
    </Switch>
  );
}

export default App;
