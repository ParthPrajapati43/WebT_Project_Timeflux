import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Profile from './Profile';
import Home from './Home';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/Profile">
            <Profile/>
          </Route>

          <Route path="/">
            <Home/>
          </Route>
          
        </Switch>
      </div>
    </Router>
  )
}

export default App