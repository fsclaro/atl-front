import { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Home from './pages/Home';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import Metrics from './pages/Metrics';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/register' exact component={Register} />
          <Route path='/tasks' exact component={Tasks} />
          <Route path='/metrics' exact component={Metrics} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
