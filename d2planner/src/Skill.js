import { useCallback, useState } from 'react';
import { debounce } from 'lodash';

import './Skill.css';

const Skill = (props) => {
  const {
    row,
    column,
    skillName,
    lvl,
    skillLevels,
    requirements,
    bonus,
    totalBonus,
    bonusMode,
    isCurrentSkill,
    isInvalid,
    isSynergy,
  } = props;

  function setLevel (lvl) {
    lvl = Math.floor(Number(lvl));
    if (lvl < 1) {
      let skillLevelsNew = {...skillLevels};
      delete skillLevelsNew[skillName]
      props.setSkillLevels(skillLevelsNew);
      return
    }
    if (!(lvl > 0)) {
      return
    }
    if (lvl > 20) {
      lvl = 20;
    }
    props.setSkillLevels({ ...skillLevels, [skillName]: lvl});
  }
  function incrementLevel () {
    let requirementsAtOne = {};
    for (const requirement of requirements) {
      requirementsAtOne[requirement.skillName] = 1;
    }
    props.setSkillLevels({ ...skillLevels, ...requirementsAtOne, [skillName]: (lvl < 20) ? lvl + 1: 20});
  }
  const setBonus = (b) => props.setSkillBonus(skillName, b);
  const setAsCurrent = () => props.setCurrentSkill(skillName);

  return (
    <div className={`skillContainer row${row} column${column}`}>
      <SkillButton
        lvl={lvl}
        bonus={bonus}
        totalBonus={totalBonus}
        bonusMode={bonusMode}
        isCurrentSkill={isCurrentSkill}
        isRequirement={isInRequirements(skillName, requirements)}
        isSynergy={isSynergy}
        isInvalid={isInvalid}
        setLevel={setLevel}
        incrementLevel={incrementLevel}
        setBonus={setBonus}
        setAsCurrent={setAsCurrent}
      />
      <SkillForm
        lvl={lvl}
        skillLevels={skillLevels}
        totalBonus={bonusMode ? 0 : totalBonus}
        setLevel={setLevel}
        setAsCurrent={setAsCurrent}
      />
    </div>
  );
};

function isInRequirements (skillName, requirements) {
  for (const requirement of requirements) {
    if (skillName === requirement.skillName) {
      return requirement;
    }
  }
  return null;
}

const SkillButton = (props) => {
  const {
    lvl,
    bonus,
    totalBonus,
    bonusMode,
    isCurrentSkill,
    isRequirement,
    isInvalid,
    isSynergy,
    setLevel,
    setBonus,
    setAsCurrent,
  } = props;
  const buttonText = (bonusMode) ? `+${totalBonus}` : null;
  const onClick = (e) => {
    if (bonusMode) {
      setBonus(bonus + 1);
      return
    }
    props.incrementLevel();
  };
  const onContextMenu = (e) => {
    e.preventDefault();
    if (bonusMode) {
      setBonus(bonus - 1);
      return
    }
    setLevel(lvl - 1);
  };
  const className = [
    'skill',
    bonusMode ? 'bonusMode' : null,
    isCurrentSkill ? 'currentSkill' : null,
    isSynergy ? 'synergy' : null,
    isRequirement ? 'requirement' : null,
    isInvalid ? 'invalid' : null,
    ((lvl + bonus) > 0) ? 'allocated' : null,
  ].join(' ')
  return (
    <div className='skillButtonContainer'>
      <button
        className={className}
        onClick={onClick}
        onMouseEnter={setAsCurrent}
        onContextMenu={onContextMenu}
      >
        {buttonText}
      </button>
    </div>
  )
};

const SkillForm = (props) => {
  const {lvl, skillLevels, totalBonus, setLevel, setAsCurrent} = props;
  const [userInput, setUserInput] = useState(lvl + totalBonus);
  const [isTyping, setIsTyping] = useState(false);

  const debouncedSetLevel = debounce(value => {
    setLevel(value)
    setIsTyping(false);
  }, 750);

  const onChange = useCallback(e => {
    setUserInput(e.target.value);
    setIsTyping(true);
    setAsCurrent();
    debouncedSetLevel(e.target.value);  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillLevels]);

  const bonusClass = ((totalBonus > 0) && isTyping === false) ? 'hasBonus' : 'noBonus';
  return (
    <input
      className={`skillPoints ${bonusClass}`}
      type="tel"
      value={isTyping ? userInput : lvl + totalBonus}
      onChange={onChange}
      onClick={setAsCurrent}
    />
  );
};

export default Skill;
