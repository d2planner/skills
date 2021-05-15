import './CharacterSelector.css'

const characters = [
  'amazon',
  'assassin',
  'barbarian',
  'druid',
  'necromancer',
  'paladin',
  'sorceress',
]

const CharacterSelector = (props) => {
  return (
    <div className='characterSelectorContainer'>
      {characters.map((character) => (
        <button
          className='characterButton'
          key={character}
          onClick={() => props.setCharacter(character)}
        >
          {character}
        </button>
      ))}
    </div>
  );
}

export default CharacterSelector;