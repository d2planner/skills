import { useCallback, useState } from 'react';
import ReactTooltip from "react-tooltip";
import { debounce } from 'lodash';

import mouseLeftImage from './assets/mouse-left-64x64.png'
import mouseRightImage from './assets/mouse-right-64x64.png'
import shiftImage from './assets/shift-128x128.png'

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
    showTooltip,
    isCurrentSkill,
    isSynergy,
  } = props;

  function setLevel (lvl) {
    lvl = Math.floor(Number(lvl));
    if (!(lvl > 0)) {
      let skillLevelsNew = {...skillLevels};
      delete skillLevelsNew[skillName]
      props.setSkillLevels(skillLevelsNew);
      return
    }
    props.setSkillLevels({ ...skillLevels, [skillName]: lvl});
  }
  function incrementLevel () {
    let requirementsAtOne = {};
    for (const requirement of requirements) {
      requirementsAtOne[requirement.skillName] = 1;
    }
    props.setSkillLevels({ ...skillLevels, ...requirementsAtOne, [skillName]: lvl + 1});
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
        showTooltip={showTooltip}
        isCurrentSkill={isCurrentSkill}
        isRequirement={isInRequirements(skillName, requirements)}
        isSynergy={isSynergy}
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
    showTooltip,
    isCurrentSkill,
    isRequirement,
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
  const tooltip = (
    <ReactTooltip
      id='skillButtonTip'
      place='right'
      effect='solid'
      type='light'
      textColor='#404040'
      borderColor='#CCCCCC'
      border={true}
    >
      <pre className='tooltipText'>
        <img className='mouseLeftImage' src={mouseLeftImage} alt='Left Click'/>
        : +1 {bonusMode ? 'bonus' : 'point'}
      </pre>
        <pre className='tooltipText'>
        <img className='mouseRightImage' src={mouseRightImage} alt='Right Click'/>
        : -1 {bonusMode ? 'bonus' : 'point'}
      </pre>
        <pre className='tooltipText'>
        <img className='shiftImage' src={shiftImage} alt='Shift'/>
        : edit bonus
      </pre>
    </ReactTooltip>
  )
  const className = [
    'skill',
    bonusMode ? 'bonusMode' : null,
    isCurrentSkill ? 'currentSkill' : null,
    isSynergy ? 'synergy' : null,
    isRequirement ? 'requirement' : null,
  ].join(' ')
  return (
    <div className='skillButtonContainer'>
      <button
        data-tip
        className={className}
        data-for='skillButtonTip'
        onClick={onClick}
        onMouseEnter={setAsCurrent}
        onContextMenu={onContextMenu}
      >
        {buttonText}
      </button>
      {showTooltip ? tooltip : null}
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
      type="number"
      value={isTyping ? userInput : lvl + totalBonus}
      onChange={onChange}
      onClick={setAsCurrent}
    />
  );
};

export default Skill;
