import './DifficultySelector.css'
import normalImage from './assets/favicon_io/normal-192x192.png'
import nightmareImage from './assets/favicon_io/nightmare-192x192.png'
import hellImage from './assets/favicon_io/hell-192x192.png'
import autoImage from './assets/favicon_io/auto-192x192.png'

const DifficultySelector = (props) => {
  return (
    <div className='difficultySelector'>
      <img className='difficulty normal' src={normalImage} alt='Normal'/>
      <img className='difficulty nightmare' src={nightmareImage} alt='Nightmare'/>
      <img className='difficulty hell' src={hellImage} alt='Hell'/>
      <img className='difficulty auto' src={autoImage} alt='Automatic'/>
    </div>
  )
}

export default DifficultySelector;
