import React, {useEffect, useState} from 'react';
import './Tooltip.css';

const Tooltip = (props) => {

  const [name, SetName] = useState("Magic Arrow")
  const [desc, setDesc] = useState("Creates a magical arrow or bolt that does extra damage")
  const [currentLevel, setCurrentLevel] = useState (1)
  const [levelDesc, setLevelDesc] = useState("Converts 1% Physical Damage to Magic Damage")
  const [attackRating, setAttackRating] = useState(10)
  const [effect, setEffect] = useState(1)
  const [cost, setCost] = useState(1.5)
  
  
  return (
    <div className='tooltipContainer'>
      <h2>{name}</h2>
      <p className='skillDescription'>
      {desc}
      </p>
      <p className='skillStats' style={{whiteSpace: 'pre'}}>{`Current Skill level: ${currentLevel}`}</p>
      <p className='skillStats' style={{whiteSpace: 'pre'}}>{levelDesc}</p>
      <p className='skillStats' style={{whiteSpace: 'pre'}}>{`To Attack Rating: +${attackRating}%` }</p>
      <p className='skillStats' style={{whiteSpace: 'pre'}}>{`Damage: +${effect}`}</p>
      <p className='skillStats' style={{whiteSpace: 'pre'}}>{`Mana Cost: ${cost}`}</p>
      
    </div>
  );
};

export default Tooltip;