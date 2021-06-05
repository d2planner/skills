import './CharacterSpace.css';
import BonusForm from './BonusForm'

const CharacterSpace = (props) => {
  const {character, allBonus, setSkillBonus} = props;
  return (
    <div className='characterSpaceContainer'>
      <BonusForm
        lvl={allBonus}
        label={'All +'}
        setLevel={(lvl) => setSkillBonus('all', lvl)}
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
