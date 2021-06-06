import './BonusForm.css'

const BonusForm = (props) => {
  const {lvl, setLevel, label} = props;
  const bonusClass = (props.lvl > 0) ? 'hasBonus' : 'noBonus';

  const handleChange = (event) => {
    const {value} = event.target;
    setLevel(value);
  }

  return (
    <div className='bonusContainer'>
      <button
        className={`bonusFormButton ${bonusClass}`}
        onClick={() => {setLevel(lvl + 1)}}
        onContextMenu = {(e) => {
          e.preventDefault();
          setLevel(lvl - 1)
        }}
      >{label}</button>
      <input
        className={`bonus ${bonusClass}`}
        type="number"
        value={lvl.toString()}
        onChange={handleChange}
      />
    </div>
  );
};

export default BonusForm;
