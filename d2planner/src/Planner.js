import React, {Component} from 'react'

import './Planner.css'
import Tooltip from './Tooltip';
import Tree from './Tree';

class Planner extends Component {
  state = {
    character: 'amazon',
    currentTab: 1,
  }

  setTab = (id) => {
    this.setState({currentTab: id})
  }

  render() {
    return (
      <div className='plannerContainer'>
        <div className='characterSelectorContainer'>
          <a>Amazon</a>
          <a>Assassin</a>
          <a>Barbarian</a>
          <a>Druid</a>
          <a>Necromancer</a>
          <a>Paladin</a>
          <a>Sorceress</a>
        </div>
        <hr></hr>
        <div className='plannerCoreContainer'>
          <Tooltip />
          <Tree
            character={this.state.character}
            currentTab={this.state.currentTab}
            setTab={this.setTab}
          />
        </div>
      </div>
    );
  }
}

export default Planner;