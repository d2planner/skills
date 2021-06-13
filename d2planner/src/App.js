import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import './App.css';
import Planner from './Planner';
import Footer from './Footer';

const  history = createBrowserHistory();

function App() {
  return (
    <Router history={history}>
        <div className="planner">
          <h1 className="mainTitle">Diablo 2 Skill Planner</h1>
          <Switch>
            <Route path="/:buildString" component={Planner}/>
            <Route path="/" component={Planner}/>
          </Switch>
          <Footer/>
        </div>
    </Router>
  );
};

export default App;
