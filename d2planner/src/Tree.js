import './Tree.css';
import Tab from './Tab.js';
import images from './assets/1.14D/game_images';

const Tree = (props) => {
  const {plannerState, treeData, character, currentTab, setTab, setSkillLevel} = props;
  const skills = treeData[currentTab]['skills'].map((skill) => {
    return (
      <Skill
          {...skill}
          lvl={plannerState[`${skill.skillName}Level`]}
          key={skill.skillName}
          setSkillLevel={setSkillLevel}
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
  const {row, column, skillName, lvl, setSkillLevel} = props;
  const onClick = () => setSkillLevel(`${skillName}`, lvl + 1);
  const onContextMenu = (e) => {
    e.preventDefault();
    if (lvl > 0) {setSkillLevel(`${skillName}`, lvl - 1)};
  };

  return (
    <div className={`skillContainer row${row} column${column}`}>
      <button
        className='skill'
        onClick={onClick}
        onContextMenu={onContextMenu}
      ></button>
      <p className='skillPoints'>{lvl}</p>
    </div>
  );
};

export default Tree;