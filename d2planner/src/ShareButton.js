import './ShareButton.css'
import shareImage from './assets/share.png';

function ShareButton () {
  return (
    <button className='shareButton'>
      <img className='shareImage' src={shareImage} alt='Share Build'/>
    </button>
  );
}

export default ShareButton;
