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
    const initialState = {
      character: 'amazon',
      currentTab: 1,
      currentSkill: 'magicArrow',
      ...getAllCharacterSkillLevels(skillData),
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
      [`${build.c}Skills`]: (build.s !== undefined) ? decompressSkills(build.s, buildSkillsMap(build.c)) : {},
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
  Object.keys(skillData.tree).forEach((character) => {
    skillLevels[`${character}Skills`] = {};
  });
  return skillLevels;
}

function getBuildString (plannerState) {
  let compressedSkills = {};
  for (const [key, value] of Object.entries(plannerState[`${plannerState.character}Skills`])) {
    const skillName = key.split('Level')[0];
    const skill = skillData.skillDetails[skillName];
    compressedSkills[skill.skillId] = value;
  }
  const buildData = {
    v: 1,  // build version
    g: '1.14D', // patch/mod version
    c: plannerState.character,  // character
    s: compressedSkills,  // skills
    t: plannerState.currentTab,
  };
  return btoa(JSON.stringify(buildData));
}

function decompressSkills (compressedSkills, skillsMap) {
  let skills = {};
  for (const [compressedKey, value] of Object.entries(compressedSkills)) {
    skills[skillsMap[compressedKey]] = value;
  }
  return skills;
}

function buildSkillsMap (character) {
  let skillMap = {};
  for (const tree of Object.values(skillData.tree[character])) {
    for (const skill of tree.skills) {
      skillMap[skill.id] = `${skill.skillName}Level`;
    }
  }
  return skillMap;
}

export {getAllCharacterSkillLevels};
export default withRouter(Planner);
