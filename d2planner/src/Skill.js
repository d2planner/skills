import './Skill.css';

const Skill = (props) => {
  const {row, column, skillName, lvl, bonus, setSkillLevel, setCurrentSkill} = props;
  const setLevel = (lvl) => (setSkillLevel(skillName, lvl));
  const setAsCurrent = () => (setCurrentSkill(skillName));

  return (
    <div className={`skillContainer row${row} column${column}`}>
      <SkillButton
        lvl={lvl}
        setLevel={setLevel}
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
  const {lvl, setLevel, setAsCurrent} = props;
  const onClick = () => setLevel(lvl + 1);
  const onContextMenu = (e) => {
    e.preventDefault();
    setLevel(lvl - 1);
  };
  return (
    <button
      className='skill'
      onClick={onClick}
      onMouseEnter={setAsCurrent}
      onContextMenu={onContextMenu}
    ></button>
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
