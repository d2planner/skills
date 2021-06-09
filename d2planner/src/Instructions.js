import './Instructions.css'
import mouseLeftImage from './assets/mouse-left-64x64.png';
import mouseRightImage from './assets/mouse-right-64x64.png';
import shiftImage from './assets/shift-128x128.png';

function Instructions (props) {
  return (
    <div className='instructionsContainer'>
      <p className='instructionsText'>
        <img className='mouseLeftImage' src={mouseLeftImage} alt='Left Click'/>
        : +1
      </p>
      <p className='instructionsText'>
        <img className='mouseRightImage' src={mouseRightImage} alt='Right Click'/>
        : -1
      </p>
      <p className='instructionsText'>
        <img className='shiftImage' src={shiftImage} alt='Shift'/>
        : bonuses
      </p>
    </div>
  );
}

export default Instructions;
