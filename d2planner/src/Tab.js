import './Tab.css'

const Tab = (props) => {
  const {id, setTab} = props
  return (
    <button className={`Tab${id}`} onClick={() => setTab(id)}>
      {`Tab ${id}`}
    </button>
  );
}

export default Tab