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
  const preambleItems = formatDesclines('dsc2', skill, lvl, skillLevels).map((line, index) => (
    <li key={index}>{line}</li>
  ));
  return (
    <div className='skillPreamble'>
      <h2 className='skillName'>{props.skill['strName']}</h2>
      <p className='skillLongName'>{props.skill['strLong'] + '\n'}</p>
      <ul className='dsc2'>{preambleItems}</ul>
    </div>
  );
};

const CurrentLevel = (props) => {
  const {skill, lvl, skillLevels} = props;
  if (lvl === 0) {
    return null;
  }
  const currentLevelItems = formatDesclines('desc', skill, lvl, skillLevels).map((line, index) => (
    <li key={index}>{line}</li>
  ));
  return (
    <div className='currentLevelBlock'>
      <h3 className='currentLevelHeader levelHeader'>{`Current Level: ${lvl}`}</h3>
      <ul className='desc'>{currentLevelItems}</ul>
    </div>
  );
};

const NextLevel = (props) => {
  const {skill, lvl, skillLevels} = props;
  const nextLevelItems = formatDesclines('desc', skill, lvl + 1, skillLevels).map((line, index) => (
    <li key={index}>{line}</li>
  ));
  return (
    <div className='nextLevelBlock'>
      <h3 className='nextLevelHeader levelHeader'>Next Level:</h3>
      <ul className='desc'>{nextLevelItems}</ul>
    </div>
  );
};

const Synergies = (props) => {
  const synergyLines = formatDesclines('dsc3', props.skill, props.lvl, props.skillLevels);
  const synergyItems = synergyLines.map((line, index) => (
    <li key={index}>{line}</li>
  ));
  return (
    <div className='synergyBlock'>
      {(synergyLines.length > 0) ? <h3 className='synergyHeader'>Synergy Bonuses:</h3> : null}
      <ul className='dsc3'>{synergyItems}</ul>
    </div>
  );
};

export default Tooltip;
