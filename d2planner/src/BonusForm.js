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
      <label className={bonusClass}>{label}</label>
      <input
        className={`bonus ${bonusClass}`}
        type="number"
        value={lvl}
        onChange={handleChange}
      />
    </div>
  );
};

export default BonusForm;
