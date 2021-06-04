import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import './App.css';
import Planner from './Planner';

const  history = createBrowserHistory();

function App() {
  return (
    <Router history={history}>
        <div className="planner">
          <h1 className="mainTitle">Diablo II Skill Planner</h1>
          <Switch>
            <Route path="/:buildString" component={Planner}/>
            <Route path="/" component={Planner}/>
          </Switch>
        </div>
    </Router>
  );
};

export default App;
