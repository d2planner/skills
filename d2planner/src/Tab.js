import './Tab.css';

const Tab = (props) => {
  const {id, treeName, setTab} = props;
  return (
    <button className={`Tab Tab${id}`} onClick={() => setTab(id)}>
      {`${treeName}`}
    </button>
  );
};

export default Tab;