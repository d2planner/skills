import './Tooltip.css'

const Tooltip = () => {
  return (
    <div className='tooltipContainer'>
      <h2>Magic Arrow</h2>
      <p className='skillDescription'>
        Creates a magical arrow or bolt that does extra damage
      </p>
      <p classname='skillStats' style={{whiteSpace: 'pre'}}>
{`Current Skill Level: 1
Converts 1% Physical Damage to Magic Damage
To Attack Rating: +10 percent
Damage: +1
Mana Cost: 1.5`}
      </p>
    </div>
  );
}

export default Tooltip;