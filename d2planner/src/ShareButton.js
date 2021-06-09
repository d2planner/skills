import ReactTooltip from "react-tooltip";

import shareImage from './assets/share.png';
import './ShareButton.css'

function ShareButton (props) {
  return (
    <div className='shareButton'>
      <button
        data-tip
        data-for='shareButtonTip'
        className='shareButton'
        onClick={() => {
          navigator.clipboard.writeText(`d2planner.github.io/${props.buildString}`);
        }}
      >
        <img className='shareImage' src={shareImage} alt='Share Build'/>
      </button>
      <ReactTooltip
        id='shareButtonTip'
        place='top'
        effect='solid'
        event='click'
        eventOff='mouseleave'
        delayHide={500}
        type='light'
        textColor='#404040'
      >
        <p className='resetTipText'>
          Copied to<br/>clipboard!
        </p>
      </ReactTooltip>
    </div>
  );
}

export default ShareButton;