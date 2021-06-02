import './Tooltip.css';
import formatDesclines from './formatDesclines';

const Tooltip = (props) => {
  const {skill, lvl, skillLevels} = props;
  if (!skill) {
    return <div className='tooltipContainer'></div>
  }

  return (
    <div className='tooltipContainer'>
      <SkillPreamble skill={skill} lvl={lvl} skillLevels={skillLevels}/>
      <CurrentLevel skill={skill} lvl={lvl} skillLevels={skillLevels}/>
      <NextLevel skill={skill} lvl={lvl} skillLevels={skillLevels}/>
      <Synergies skill={skill} lvl={lvl} skillLevels={skillLevels}/>
    </div>
  );
};

const SkillPreamble = (props) => {
  const {skill, lvl, skillLevels} = props;
  return (
    <div className='skillPreamble'>
      <h2 className='skillName'>{props.skill['strName']}</h2>
      <p className='skillLongName'>{props.skill['strLong'] + '\n'}</p>
      {formatDesclines('dsc2', skill, lvl, skillLevels)}
    </div>
  );
};

const CurrentLevel = (props) => {
  const {skill, lvl, skillLevels} = props;
  if (lvl === 0) {
    return null;
  }
  return (
    <div className='currentLevelBlock'>
      <h3 className='currentLevelHeader levelHeader'>{`Current Level: ${lvl}`}</h3>
      {formatDesclines('desc', skill, lvl, skillLevels)}
    </div>
  );
};

const NextLevel = (props) => {
  const {skill, lvl, skillLevels} = props;
  return (
    <div className='nextLevelBlock'>
      <h3 className='nextLevelHeader levelHeader'>Next Level:</h3>
      {formatDesclines('desc', skill, lvl + 1, skillLevels)}
    </div>
  );
};

const Synergies = (props) => (
  <div className='synergyBlock'>
    {formatDesclines('dsc3', props.skill, props.lvl, props.skillLevels)}
  </div>
);

export default Tooltip;