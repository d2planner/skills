import './Tooltip.css';
import formatDesclines from './formatDesclines';

const Tooltip = (props) => {
  const {skill, lvl, plannerState} = props;
  return (
    <div className='tooltipContainer'>
      <SkillPreamble skill={skill} lvl={lvl} plannerState={plannerState}/>
      <CurrentLevel skill={skill} lvl={lvl} plannerState={plannerState}/>
      <NextLevel skill={skill} lvl={lvl} plannerState={plannerState}/>
      <Synergies skill={skill} lvl={lvl} plannerState={plannerState}/>
    </div>
  );
};

const SkillPreamble = (props) => {
  const {skill, lvl, plannerState} = props;
  return (
    <div className='skillPreamble'>
      <h2 className='skillName'>{props.skill['strName']}</h2>
      <p className='skillLongName'>{props.skill['strLong'] + '\n'}</p>
      <p className='staticDesclines'>{formatDesclines('dsc2', skill, lvl, plannerState)}</p>
    </div>
  );
};

const CurrentLevel = (props) => {
  const {skill, lvl, plannerState} = props;
  if (lvl === 0) {
    return null;
  }

  return (
    <div className='currentLevelBlock'>
      <h3 className='currentLevelHeader levelHeader'>{`Current Level: ${lvl}`}</h3>
      <p className='levelDesclines'>{formatDesclines('desc', skill, lvl, plannerState)}</p>
    </div>
  );
};

const NextLevel = (props) => {
  const {skill, lvl, plannerState} = props;
  return (
    <div className='nextLevelBlock'>
      <h3 className='nextLevelHeader levelHeader'>Next Level:</h3>
      <p className='levelDesclines'>{formatDesclines('desc', skill, lvl + 1, plannerState)}</p>
    </div>
  );
};

const Synergies = (props) => (
  <p className='synergies'>{formatDesclines('dsc3', props.skill, props.lvl, props.plannerState)}</p>
)

export default Tooltip;