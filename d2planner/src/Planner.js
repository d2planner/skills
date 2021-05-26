import React, {Component} from 'react'

import './Planner.css'
import skillData from './assets/1.14D/game_data/d2_skill_data.json'
import CharacterSelector from './CharacterSelector';
import Tooltip from './Tooltip';
import Tree from './Tree';

class Planner extends Component {
  state = {
    character: 'amazon',
    currentTab: 1,
  }

  setTab = (id) => {this.setState({currentTab: id})}
  setCharacter = (character) => this.setState({character: character})

  render() {
    return (
      <div className='plannerContainer'>
        <CharacterSelector
          character={this.state.character}
          setCharacter={this.setCharacter}
          setTab={this.setTab}
        />
        <hr></hr>
        <div className='plannerCoreContainer'>
          <Tooltip />
          <Tree
            character={this.state.character}
            treeData={skillData.tree}
            currentTab={this.state.currentTab}
            setTab={this.setTab}
          />
        </div>
      </div>
    );
  }
}

export default Planner;