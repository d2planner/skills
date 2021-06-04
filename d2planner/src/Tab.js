import './Tab.css';

const Tab = (props) => {
  const {id, treeName, treeBonus, setTab, setBonusLevel} = props;
  return (
    <div className={`tabContainer tab${id}Container`}>
      <button className={`Tab Tab${id}`} onClick={() => setTab(id)}>
        {treeName}
      </button>
      <BonusForm
        lvl={treeBonus}
        setLevel={(lvl) => setBonusLevel(`tab${id}`, lvl)}
      />
    </div>
  );
};

const BonusForm = (props) => {
  const {lvl, setLevel} = props;

  const handleChange = (event) => {
    const {value} = event.target;
    setLevel(value);
  }

  return (
    <div className='tabBonusContainer'>
      <label>+</label>
      <input
        className='tabBonus'
        type="number"
        value={lvl}
        onChange={handleChange}
      />
    </div>
  );
};

export default Tab;