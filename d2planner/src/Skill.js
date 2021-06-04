import './Skill.css';

const Skill = (props) => {
  const {row, column, skillName, lvl, setSkillLevel, setCurrentSkill} = props;
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
    if (lvl > 0) {
      setLevel(lvl - 1);
    };
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
  const {lvl, setLevel, setAsCurrent} = props;

  const handleChange = (event) => {
    const {value} = event.target;
    setAsCurrent();
    setLevel(value);
  }

  return (
      <input
        className='skillPoints'
        type="number"
        value={lvl}
        onChange={handleChange}
        onClick={setAsCurrent}
      />
  );
};

export default Skill;
