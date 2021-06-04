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
  const onHover = setAsCurrent;
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
      onMouseEnter={onHover}
      onContextMenu={onContextMenu}
    ></button>
  )
};

const SkillForm = (props) => {
  const {lvl, setLevel, setAsCurrent} = props;

  const handleChange = (event) => {
    const {value} = event.target;
    setAsCurrent();
    if (isPositiveInteger(value)) {
      setLevel(Number(value));
    } else if (!value) {
      setLevel(0);
    }
  }

  return (
    <form>
      <input
        className='skillPoints'
        type="text"
        value={lvl}
        onChange={handleChange}
      />
    </form>
  );
};

function isPositiveInteger(str) {
  str = str.trim();
  if (!str) {
    return false;
  }
  str = str.replace(/^0+/, "") || "0";
  const num = Math.floor(Number(str));
  return num !== Infinity && String(num) === str && num >= 0;
}

export default Skill;
