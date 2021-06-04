import './CharacterSpace.css';
import BonusForm from './BonusForm'

const CharacterSpace = (props) => {
  const {character, allBonus, setBonusLevel} = props;
  return (
    <div className='characterSpaceContainer'>
      <BonusForm
        lvl={allBonus}
        label={'All +'}
        setLevel={(lvl) => setBonusLevel('all', lvl)}
      />
      <CharacterLevel
        character={character}
        lvl={74}
      />
    </div>
  );
};

const CharacterLevel = (props) => {
  return (
    <div className='characterLevelContainer'>
      <p className='characterText'>{'Character Level'}</p>
      <p className='characterLevel'>{props.lvl}</p>
    </div>
  )
}

export default CharacterSpace;
