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
      <p className='staticDesclines'>{formatDesclines('dsc2', skill, lvl, skillLevels)}</p>
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
      <p className='levelDesclines'>{formatDesclines('desc', skill, lvl, skillLevels)}</p>
    </div>
  );
};

const NextLevel = (props) => {
  const {skill, lvl, skillLevels} = props;
  return (
    <div className='nextLevelBlock'>
      <h3 className='nextLevelHeader levelHeader'>Next Level:</h3>
      <p className='levelDesclines'>{formatDesclines('desc', skill, lvl + 1, skillLevels)}</p>
    </div>
  );
};

const Synergies = (props) => (
  <p className='synergies'>{formatDesclines('dsc3', props.skill, props.lvl, props.skillLevels)}</p>
)

export default Tooltip;