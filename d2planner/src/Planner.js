import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import './Planner.css';
import skillData from './assets/1.14D/game_data/d2_skill_data.json';
import getBuildString, { buildSkillsMap, decompressSkills} from './buildStrings'
import CharacterSelector from './CharacterSelector';
import Tooltip from './Tooltip';
import Tree from './Tree';

const  history = createBrowserHistory();

class Planner extends Component {
  constructor (props) {
    super(props);
    const initialState = {
      character: 'amazon',
      currentTab: 1,
      currentSkill: 'magicArrow',
      ...getEmptySkillLevels(skillData),
    };
    const { buildCode } = props.match.params;
    const build = (buildCode) ? JSON.parse(atob(buildCode)) : {};
    if (!build.c) {
      this.state = {...initialState};
      return
    }
    this.state = {
      ...initialState,
      character: build.c,
      currentSkill: skillData.tree[build.c][1].skills[0].skillName,
      currentTab: build.t || 1,
      [`${build.c}Skills`]: (build.s !== undefined) ? decompressSkills(build.s, buildSkillsMap(skillData.tree[build.c])) : {},
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
    history.push(getBuildString(this.state, skillData.skillDetails));

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

function getEmptySkillLevels (skillData) {
  let skillLevels = {};
  Object.keys(skillData.tree).forEach((character) => {
    skillLevels[`${character}Skills`] = {};
  });
  return skillLevels;
}

export default withRouter(Planner);
