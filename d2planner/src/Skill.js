import './Skill.css';

const Skill = (props) => {
  const {row, column, skillName, lvl, bonus, bonusMode} = props;
  const setLevel = (lvl) => (props.setSkillLevel(skillName, lvl));
  const setBonus = (lvl) => (props.setBonusLevel(skillName, lvl));
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
        lvl={lvl}
        bonus={bonus}
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
  const {lvl, bonus, setLevel, setAsCurrent} = props;
  const bonusClass = (bonus > 0) ? 'hasBonus' : 'noBonus';

  const handleChange = (event) => {
    const {value} = event.target;
    setAsCurrent();
    const newLvl = Math.floor(Number(value)) - bonus;
    setLevel(newLvl);
  }
  return (
    <input
      className={`skillPoints ${bonusClass}`}
      type="number"
      value={(lvl + bonus).toString()}
      onChange={handleChange}
      onClick={setAsCurrent}
    />
  );
};

export default Skill;
