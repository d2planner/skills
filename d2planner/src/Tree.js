import React, { useState } from 'react';
import { debounce } from 'lodash';

import './Tree.css';
import {getTotalBonus} from './calculateSkillValue'
import CharacterSpace from './CharacterSpace'
import Skill from './Skill'
import Tab from './Tab';
import images from './assets/1.14D/game_images';

const Tree = (props) => {
  const {skillLevels, skillBonuses, treeData, character, currentTab, currentSkill, synergies} = props;
  const relevantRequirements = props.requirements.filter(r => (!(skillLevels[r.skillName] > 0)))
  const [bonusMode, setBonusMode] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);



  React.useEffect(() => {
    function handleKeyDown (event) {
      if (['Shift', 'CapsLock'].includes(event.key)) {
        setBonusMode(event.getModifierState('CapsLock') ? false : true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  React.useEffect(() => {
    function handleKeyUp (event) {
      const debouncedDisableTooltip = debounce(() => setShowTooltip(false), 5000);
      if (['Shift', 'CapsLock'].includes(event.key)) {
        setBonusMode(event.getModifierState('CapsLock') ? true : false);
        debouncedDisableTooltip();
      }
    }
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

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
  const skills = treeData[currentTab].skills.map((skill) => {
    const lvl = skillLevels[skill.skillName] || 0;
    const skillBonus = skillBonuses[skill.skillName] || 0;
    return (
      <Skill
          {...skill}
          key={skill.skillName}
          lvl={lvl}
          skillLevels={skillLevels}
          requirements={relevantRequirements}
          bonus={skillBonus}
          totalBonus={getTotalBonus(lvl, skillBonus, generalBonus)}
          bonusMode={bonusMode}
          showTooltip={showTooltip}
          isCurrentSkill={skill.skillName === currentSkill}
          isSynergy={synergies.includes(skill.skillName)}
          setSkillLevels={(skillLevels) => props.setSkillLevels(character, skillLevels)}
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
