import React, {Component} from 'react';

import './Planner.css';
import skillData from './assets/1.14D/game_data/d2_skill_data.json';
import CharacterSelector from './CharacterSelector';
import Tooltip from './Tooltip';
import Tree from './Tree';

class Planner extends Component {
  state = {
    character: 'amazon',
    currentTab: 1,
    currentSkill: 'magicArrow',
    ...Object.keys(skillData.skillDetails).reduce((o, key) => ({ ...o, [`${key}Level`]: 0}), {}),
  };

  setTab = (id) => this.setState({currentTab: id});
  setCharacter = (character) => this.setState({character: character});
  setSkillLevel = (skillName, lvl) => this.setState({[`${skillName}Level`]: lvl});
  setCurrentSkill = (skillName) => this.setState({currentSkill: skillName});

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
          <Tooltip
            skill={skillData.skillDetails[this.state.currentSkill]}
            lvl={this.state[`${this.state.currentSkill}Level`]}
            plannerState={this.state}
          />
          <Tree
            plannerState={this.state}
            treeData={skillData.tree[this.state.character]}
            character={this.state.character}
            currentTab={this.state.currentTab}
            setTab={this.setTab}
            setSkillLevel={this.setSkillLevel}
            setCurrentSkill={this.setCurrentSkill}
          />
        </div>
      </div>
    );
  };
};

export default Planner;