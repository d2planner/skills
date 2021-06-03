import './Tree.css';
import Tab from './Tab.js';
import images from './assets/1.14D/game_images';

const Tree = (props) => {
  const {skillLevels, treeData, character, currentTab, setTab, setSkillLevels, setCurrentSkill} = props;

  const setSkillLevel = (skillName, lvl) => {
    if (lvl === 0) {
      let skillLevelsNew = {...skillLevels};
      delete skillLevelsNew.skillName;
      setSkillLevels(character, {skillLevelsNew});
    }
    setSkillLevels(character, { ...skillLevels, [`${skillName}Level`]: lvl});
  }

  const skills = treeData[currentTab]['skills'].map((skill) => {
    return (
      <Skill
          {...skill}
          lvl={skillLevels[`${skill.skillName}Level`] || 0}
          key={skill.skillName}
          setSkillLevel={setSkillLevel}
          setCurrentSkill={setCurrentSkill}
      />
    );
  });
  return (
    <div className='treeContainer'>
      <img
        className='tree'
        src={images[`${character}Tree${currentTab}`]}
        alt='Skill Tree'
      />
      {skills}
      <Tab id={1} treeName={treeData[1]['treeName']} setTab={setTab}/>
      <Tab id={2} treeName={treeData[2]['treeName']} setTab={setTab}/>
      <Tab id={3} treeName={treeData[3]['treeName']} setTab={setTab}/>
    </div>
  );
};

const Skill = (props) => {
  const {row, column, skillName, lvl, setSkillLevel, setCurrentSkill} = props;
  const onClick = () => setSkillLevel(`${skillName}`, lvl + 1);
  const onHover = () => setCurrentSkill(`${skillName}`)
  const onContextMenu = (e) => {
    e.preventDefault();
    if (lvl > 0) {setSkillLevel(`${skillName}`, lvl - 1)};
  };

  return (
    <div className={`skillContainer row${row} column${column}`}>
      <button
        className='skill'
        onClick={onClick}
        onMouseEnter={onHover}
        onContextMenu={onContextMenu}
      ></button>
      <p className='skillPoints'>{lvl}</p>
    </div>
  );
};

export default Tree;