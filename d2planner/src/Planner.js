import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import './Planner.css';
import skillData from './assets/1.14D/game_data/d2_skill_data.json';
import stateToBuildString, { buildStringToState } from './buildStrings'
import CharacterSelector from './CharacterSelector';
import DifficultySelector from './DifficultySelector';
import Tooltip from './Tooltip';
import Tree from './Tree';

const  history = createBrowserHistory();

class Planner extends Component {
  constructor (props) {
    super(props);
    const initialState = {
      character: 'sorceress',
      currentTab: 1,
      currentSkill: 'fireBolt',
      ...getEmptySkillLevels(skillData),
      ...getEmptySkillBonuses(skillData),
    };
    const { buildString } = props.match.params;
    this.state = {
      ...initialState,
      ...buildStringToState(buildString, skillData.tree),
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
  setSkillLevels = (character, skillLevels) => this.setState({[`${character}SkillLevels`]: skillLevels});
  setSkillBonuses = (character, skillBonuses) => this.setState({[`${character}SkillBonuses`]: skillBonuses});
  setCurrentSkill = (skillName) => this.setState({currentSkill: skillName});

  render() {
    history.push(stateToBuildString(this.state, skillData.skillDetails));
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
            skillLevels={this.state[`${this.state.character}SkillLevels`]}
            skillBonuses={this.state[`${this.state.character}SkillBonuses`]}
          />
          <div className='treeWithOptionsContainer'>
            <Tree
              skillLevels={this.state[`${this.state.character}SkillLevels`]}
              skillBonuses={this.state[`${this.state.character}SkillBonuses`]}
              treeData={skillData.tree[this.state.character]}
              character={this.state.character}
              currentSkill={this.state.currentSkill}
              currentTab={this.state.currentTab}
              synergies={skillData.skillDetails[this.state.currentSkill].synergies || []}
              setTab={this.setTab}
              setSkillLevels={this.setSkillLevels}
              setSkillBonuses={this.setSkillBonuses}
              setCurrentSkill={this.setCurrentSkill}
            />
            <DifficultySelector/>
          </div>
        </div>
      </div>
    );
  };
};

function getEmptySkillLevels (skillData) {
  let skillLevels = {};
  Object.keys(skillData.tree).forEach((character) => {
    skillLevels[`${character}SkillLevels`] = {};
  });
  return skillLevels;
}

function getEmptySkillBonuses (skillData) {
  let skillLevels = {};
  Object.keys(skillData.tree).forEach((character) => {
    skillLevels[`${character}SkillBonuses`] = {};
  });
  return skillLevels;
}

export default withRouter(Planner);
