import './CharacterSpace.css';
import BonusForm from './BonusForm'

const CharacterSpace = (props) => {
  const {character, characterLevel, allBonus, setSkillBonus} = props;
  return (
    <div className='characterSpaceContainer'>
      <BonusForm
        lvl={allBonus}
        label={'All +'}
        setLevel={(lvl) => setSkillBonus('all', lvl)}
      />
      <CharacterLevel
        character={character}
        lvl={characterLevel}
      />
    </div>
  );
};

const CharacterLevel = (props) => {
  return (
    <div className='characterLevelContainer'>
      <p className='characterText'>Level</p>
      <p className='characterLevel'>{props.lvl}</p>
    </div>
  )
}

export default CharacterSpace;
