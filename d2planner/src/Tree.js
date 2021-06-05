import React, { useState } from 'react';

import './Tree.css';
import {getTotalBonus} from './calculateSkillValue'
import CharacterSpace from './CharacterSpace'
import Skill from './Skill'
import Tab from './Tab';
import images from './assets/1.14D/game_images';

const Tree = (props) => {
  const [bonusMode, setBonusMode] = useState(false);

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    // cleanup this component
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  React.useEffect(() => {
    window.addEventListener('keyup', handleKeyUp);

    // cleanup this component
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);  

  function handleKeyDown (event) {
    if (['Shift', 'CapsLock'].includes(event.key)) {
      setBonusMode(event.getModifierState('CapsLock') ? false : true);
    }
  }

  function handleKeyUp (event) {
    if (['Shift', 'CapsLock'].includes(event.key)) {
      setBonusMode(event.getModifierState('CapsLock') ? true : false);
    }
  }

  const {skillLevels, skillBonuses, treeData, character, currentTab} = props;

  const setSkillLevel = createSkillLevelSetter(character, skillLevels, props.setSkillLevels);
  const setBonusLevel = createSkillLevelSetter(character, skillBonuses, props.setSkillBonuses);

  const generalBonus = (skillBonuses.all || 0) + (skillBonuses[`tab${currentTab}`] || 0);
  const skills = treeData[currentTab]['skills'].map((skill) => {
    const lvl = skillLevels[skill.skillName] || 0;
    const skillBonus = skillBonuses[skill.skillName] || 0;
    return (
      <Skill
          {...skill}
          key={skill.skillName}
          lvl={lvl}
          bonus={getTotalBonus(lvl, skillBonus, generalBonus)}
          bonusMode={bonusMode}
          setSkillLevel={setSkillLevel}
          setBonusLevel={setBonusLevel}
          setCurrentSkill={props.setCurrentSkill}
      />
    )
  });
  const tabs = [1, 2, 3].map((id) => (
    <Tab
      key={id}
      id={id}
      treeName={treeData[id]['treeName']}
      treeBonus={skillBonuses[`tab${id}`] || 0}
      setTab={props.setTab}
      setBonusLevel={setBonusLevel}
    />
  ))
  return (
    <div className='treeContainer'>
      <img
        className='tree'
        src={images[`${character}Tree${currentTab}`]}
        alt='Skill Tree'
      />
      {skills}
      {tabs}
      <CharacterSpace
        character={character}
        allBonus={skillBonuses.all || 0}
        setBonusLevel={setBonusLevel}
      />
    </div>
  );
};

function createSkillLevelSetter (character, skillLevels, setStateFunction) {
  function setter (key, lvl) {
    lvl = Math.floor(Number(lvl));
    if (!(lvl >= 0)) {
      return
    } 
    if (lvl === 0) {
      let skillLevelsNew = {...skillLevels};
      delete skillLevelsNew[key]
      setStateFunction(character, skillLevelsNew);
      return
    }
    setStateFunction(character, { ...skillLevels, [key]: lvl});
  }
  return setter;
}

export default Tree;
