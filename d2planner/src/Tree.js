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
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  React.useEffect(() => {
    window.addEventListener('keyup', handleKeyUp);
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
  function setSkillLevel (key, lvl) {
    lvl = Math.floor(Number(lvl));
    if (!(lvl > 0)) {
      let skillLevelsNew = {...skillLevels};
      delete skillLevelsNew[key]
      props.setSkillLevels(character, skillLevelsNew);
      return
    }
    props.setSkillLevels(character, { ...skillLevels, [key]: lvl});
  }
  function setSkillBonus (key, bonus) {
    bonus = Math.floor(Number(bonus));
    if (!(bonus > 0)) {
      let skillBonusesNew = {...skillBonuses};
      delete skillBonusesNew[key]
      props.setSkillBonuses(character, skillBonusesNew);
      return
    }
    props.setSkillBonuses(character, { ...skillBonuses, [key]: bonus});
  }

  const generalBonus = (skillBonuses.all || 0) + (skillBonuses[`tab${currentTab}`] || 0);
  const skills = treeData[currentTab]['skills'].map((skill) => {
    const lvl = skillLevels[skill.skillName] || 0;
    const skillBonus = skillBonuses[skill.skillName] || 0;
    return (
      <Skill
          {...skill}
          key={skill.skillName}
          lvl={lvl}
          bonus={skillBonus}
          totalBonus={getTotalBonus(lvl, skillBonus, generalBonus)}
          bonusMode={bonusMode}
          setSkillLevel={setSkillLevel}
          setSkillBonus={setSkillBonus}
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
      setSkillBonus={setSkillBonus}
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
        setSkillBonus={setSkillBonus}
      />
    </div>
  );
};

export default Tree;
