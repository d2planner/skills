import './Tab.css';
import BonusForm from './BonusForm'

const Tab = (props) => {
  const {id, treeName, treeBonus, setTab, setBonusLevel} = props;
  return (
    <div className={`tabContainer tab${id}Container`}>
      <button className={`Tab Tab${id}`} onClick={() => setTab(id)}>
        {treeName}
      </button>
      <BonusForm
        lvl={treeBonus}
        label={'+'}
        setLevel={(lvl) => setBonusLevel(`tab${id}`, lvl)}
      />
    </div>
  );
};

export default Tab;
