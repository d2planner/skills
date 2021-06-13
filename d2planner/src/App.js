import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import './App.css';
import Planner from './Planner';
import Footer from './Footer';

const  history = createBrowserHistory();

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL} history={history}>
        <div className="planner">
          <h1 className="mainTitle">Diablo 2 Skill Planner</h1>
          <Route path="/" component={Planner}/>
          <Footer/>
        </div>
    </Router>
  );
};

export default App;
