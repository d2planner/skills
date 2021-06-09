import './DifficultySelector.css'
import images from './assets/favicon_io';

const DifficultySelector = (props) => {
  return (
    <div className='difficultySelector'>
      <DifficultyOption optionKind='Normal' {...props}/>
      <DifficultyOption optionKind='Nightmare' {...props}/>
      <DifficultyOption optionKind='Hell' {...props}/>
      <AutoOption {...props}/>
    </div>
  )
}

const DifficultyOption = (props) => {
  const {optionKind} = props;
  const buttonClass = [
    'difficulty',
    optionKind,
    getDifficultyButtonState(optionKind === props.difficulty, props.difficultyAuto),
  ].join(' ');
  return (
    <button
      className={buttonClass}
      onClick={() => props.setDifficulty(optionKind)}
    >
      <img className='difficulty' src={images[`${optionKind}Image`]} alt={optionKind}/>
    </button>
  )
}

const AutoOption = (props) => {
  const buttonClass = [
    'auto',
    props.difficultyAuto ? 'autoSelected' : null,
  ].join(' ');
  return (
    <button
      className={buttonClass}
      onClick={() => {
        if (props.difficultyAuto) {
          props.setDifficultyAuto(false)
        } else {
          props.setDifficultyAuto(true)
        }
      }}
    >
      <img className='auto' src={images['autoImage']} alt='Automatic'/>
    </button>
  )
}

function getDifficultyButtonState (isSelected, difficultyAuto) {
  if (isSelected) {
    return difficultyAuto ? 'difficultyAutoSelected' : 'difficultySelected'
  }
  return null
}


export default DifficultySelector;
