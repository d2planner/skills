import { useCallback, useState } from 'react';
import { debounce } from 'lodash';

import './Skill.css';

const Skill = (props) => {
  const {row, column, skillName, lvl, bonus, totalBonus, bonusMode} = props;
  const setLevel = (l) => (props.setSkillLevel(skillName, l));
  const setBonus = (b) => (props.setSkillBonus(skillName, b));
  const setAsCurrent = () => (props.setCurrentSkill(skillName));

  return (
    <div className={`skillContainer row${row} column${column}`}>
      <SkillButton
        lvl={lvl}
        bonus={bonus}
        bonusMode={bonusMode}
        setLevel={setLevel}
        setBonus={setBonus}
        setAsCurrent={setAsCurrent}
      />
      <SkillForm
        skillName={skillName}
        lvl={lvl}
        totalBonus={totalBonus}
        setLevel={setLevel}
        setAsCurrent={setAsCurrent}
      />
    </div>
  );
};

const SkillButton = (props) => {
  const {lvl, bonus, setLevel, bonusMode, setBonus, setAsCurrent} = props;
  const buttonText = (bonusMode) ? `+${bonus}` : null;
  const onClick = (e) => {
    if (bonusMode) {
      setBonus(bonus + 1);
      return
    }
    setLevel(lvl + 1);
  };
  const onContextMenu = (e) => {
    e.preventDefault();
    if (bonusMode) {
      setBonus(bonus - 1);
      return
    }
    setLevel(lvl - 1);
  };
  return (
    <button
      className={`skill ${(bonusMode) ? 'bonusMode' : null}`}
      onClick={onClick}
      onMouseEnter={setAsCurrent}
      onContextMenu={onContextMenu}
    >{buttonText}</button>
  )
};

const SkillForm = (props) => {
  const {skillName, lvl, totalBonus, setLevel, setAsCurrent} = props;
  const [userInput, setUserInput] = useState(lvl + totalBonus);
  const [isTyping, setIsTyping] = useState(false);

  const saveNewLevel = (value) => {
    setLevel(value);
    setIsTyping(false);
  }
  const delayedSaveNewLevel = debounce(v => saveNewLevel(v), 1000);
  const onChange = e => {
    setUserInput(e.target.value);
    setIsTyping(true);
    setAsCurrent();
    delayedSaveNewLevel(e.target.value);
  }

  const bonusClass = (totalBonus > 0) ? 'hasBonus' : 'noBonus';
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
