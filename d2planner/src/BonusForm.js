import './BonusForm.css'

const BonusForm = (props) => {
  const {lvl, setLevel, label} = props;

  const handleChange = (event) => {
    const {value} = event.target;
    setLevel(value);
  }

  return (
    <div className='bonusContainer'>
      <label>{label}</label>
      <input
        className='bonus'
        type="number"
        value={lvl}
        onChange={handleChange}
      />
    </div>
  );
};

export default BonusForm;
