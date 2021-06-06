import { useCallback, useState } from 'react';
import ReactTooltip from "react-tooltip";
import { debounce } from 'lodash';

import mouseLeftImage from './assets/mouse-left-64x64.png'
import mouseRightImage from './assets/mouse-right-64x64.png'
import shiftImage from './assets/shift-128x128.png'

import './Skill.css';

const Skill = (props) => {
  const {row, column, skillName, lvl, skillLevels, bonus, totalBonus, bonusMode} = props;
  const setLevel = (l) => (props.setSkillLevel(skillName, l));
  const setBonus = (b) => (props.setSkillBonus(skillName, b));
  const setAsCurrent = () => (props.setCurrentSkill(skillName));

  return (
    <div className={`skillContainer row${row} column${column}`}>
      <SkillButton
        lvl={lvl}
        bonus={bonus}
        totalBonus={totalBonus}
        bonusMode={bonusMode}
        setLevel={setLevel}
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

const SkillButton = (props) => {
  const {lvl, bonus, totalBonus, bonusMode, setLevel, setBonus, setAsCurrent} = props;
  const buttonText = (bonusMode) ? `+${totalBonus}` : null;
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
    <div className='skillButtonContainer'>
      <button
        data-tip
        className={`skill ${(bonusMode) ? 'bonusMode' : null}`}
        data-for='skillButtonTip'
        onClick={onClick}
        onMouseEnter={setAsCurrent}
        onContextMenu={onContextMenu}
      >
        {buttonText}
      </button>
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
