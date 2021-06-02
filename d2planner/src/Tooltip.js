import './Tooltip.css';
import formatDesclines from './formatDesclines';

const Tooltip = (props) => {
  const {skill, lvl, skillLevels} = props;
  if (!skill) {
    return <div className='tooltipContainer'></div>
  }

  const synergyLines = formatDesclines('dsc3', skill, lvl, skillLevels);
  const currentLevelLines = formatDesclines('desc', skill, lvl, skillLevels);
  const nextLevelLines = formatDesclines('desc', skill, lvl + 1, skillLevels);

  return (
    <div className='tooltipContainer'>
      <SkillPreamble skill={skill} lvl={lvl} skillLevels={skillLevels}/>
      <CurrentLevel lvl={lvl} lines={currentLevelLines}/>
      <NextLevel lines={(lvl > 0) ? nextLevelLines.filter(item => (!currentLevelLines.includes(item))) : nextLevelLines}/>
      <Synergies lines={synergyLines}/>
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
  if (props.lvl === 0) {
    return null;
  }
  const currentLevelItems = props.lines.map((line, index) => (<li key={index}>{line}</li>));
  return (
    <div className='currentLevelBlock'>
      <h3 className='currentLevelHeader levelHeader'>{`Current Level: ${props.lvl}`}</h3>
      <ul className='desc'>{currentLevelItems}</ul>
    </div>
  );
};

const NextLevel = (props) => {
  const nextLevelItems = props.lines.map((line, index) => (<li key={index}>{line}</li>));
  return (
    <div className='nextLevelBlock'>
      <h3 className='nextLevelHeader levelHeader'>Next Level:</h3>
      <ul className='desc'>{nextLevelItems}</ul>
    </div>
  );
};

const Synergies = (props) => {
  const synergyItems = props.lines.map((line, index) => (<li key={index}>{line}</li>));
  return (
    <div className='synergyBlock'>
      {(props.lines.length > 0) ? <h3 className='synergyHeader'>Synergy Bonuses:</h3> : null}
      <ul className='dsc3'>{synergyItems}</ul>
    </div>
  );
};

export default Tooltip;
