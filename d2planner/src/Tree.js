import './Tree.css';
import Skill from './Skill'
import Tab from './Tab';
import images from './assets/1.14D/game_images';

const Tree = (props) => {
  const {skillLevels, treeData, character, currentTab, setTab, setSkillLevels, setCurrentSkill} = props;

  const setSkillLevel = (skillName, lvl) => {
    if (lvl === 0) {
      let skillLevelsNew = {...skillLevels};
      delete skillLevelsNew[`${skillName}Level`]
      setSkillLevels(character, skillLevelsNew);
      return
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

export default Tree;
