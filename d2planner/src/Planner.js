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
    ...getAllCharacterSkillLevels(skillData),
  };

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
            lvl={this.state[`${this.state.character}Skills`][`${this.state.currentSkill}Level`]}
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
    Object.values(tabs).forEach((tab) => {
      Object.values(tab.skills).forEach((skill) => {
        skillLevels[`${character}Skills`][`${skill.skillName}Level`] = 0;
      });
    });
  });
  return skillLevels;
}

export {getAllCharacterSkillLevels};
export default Planner;