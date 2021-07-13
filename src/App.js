import { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Home from './pages/Home';
import Register from './pages/Register';
import Tasks from './pages/Tasks';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/register' exact component={Register} />
          <Route path='/tasks' exact component={Tasks} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
