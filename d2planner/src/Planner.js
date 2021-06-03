import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import './Planner.css';
import skillData from './assets/1.14D/game_data/d2_skill_data.json';
import CharacterSelector from './CharacterSelector';
import Tooltip from './Tooltip';
import Tree from './Tree';

const  history = createBrowserHistory();

class Planner extends Component {
  constructor (props) {
    super(props);
    const { build } = props.match.params;
    if (build) {
      console.log(atob(build))
    }
    this.state = {
      character: 'amazon',
      currentTab: 1,
      currentSkill: 'magicArrow',
      ...getAllCharacterSkillLevels(skillData),
    };
  }

  setTab = (id) => this.setState({
    currentTab: id,
    currentSkill: skillData.tree[this.state.character][id].skills[0].skillName,
  });
  setCharacter = (character) => this.setState({
    character: character,
    currentTab: 1,
    currentSkill: skillData.tree[character][1].skills[0].skillName,
  });
  setSkillLevels = (character, skillLevels) => this.setState({[`${character}Skills`]: skillLevels});
  setCurrentSkill = (skillName) => this.setState({currentSkill: skillName});

  render() {
    history.push(getBuildString(this.state));

    return (
      <div className='plannerContainer'>
        <CharacterSelector
          character={this.state.character}
          setCharacter={this.setCharacter}
        />
        <hr></hr>
        <div className='plannerCoreContainer'>
          <Tooltip
            skill={skillData.skillDetails[this.state.currentSkill]}
            lvl={this.state[`${this.state.character}Skills`][`${this.state.currentSkill}Level`] || 0}
            skillLevels={this.state[`${this.state.character}Skills`]}
          />
          <Tree
            skillLevels={this.state[`${this.state.character}Skills`]}
            treeData={skillData.tree[this.state.character]}
            character={this.state.character}
            currentTab={this.state.currentTab}
            setTab={this.setTab}
            setSkillLevels={this.setSkillLevels}
            setCurrentSkill={this.setCurrentSkill}
          />
        </div>
      </div>
    );
  };
};

function getAllCharacterSkillLevels (skillData) {
  let skillLevels = {};
  Object.entries(skillData.tree).forEach((entry) => {
    const [character, tabs] = entry;
    skillLevels[`${character}Skills`] = {};
  });
  return skillLevels;
}

function getBuildString (plannerState) {
  let buildData = {
    buildVersion: 1,
    character: plannerState.character,
    ...plannerState[`${plannerState.character}Skills`],
  }
  return btoa(JSON.stringify(buildData))
}

export {getAllCharacterSkillLevels};
export default withRouter(Planner);