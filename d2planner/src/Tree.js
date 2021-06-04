import './Tree.css';
import Skill from './Skill'
import Tab from './Tab';
import images from './assets/1.14D/game_images';

const Tree = (props) => {
  const {skillLevels, treeData, character, currentTab} = props;

  function setSkillLevel (skillName, lvl) {
    lvl = Math.floor(Number(lvl));
    if (!(lvl >= 0)) {
      return
    } 
    if (lvl === 0) {
      let skillLevelsNew = {...skillLevels};
      delete skillLevelsNew[skillName]
      props.setSkillLevels(character, skillLevelsNew);
      return
    }
    props.setSkillLevels(character, { ...skillLevels, [skillName]: lvl});
  }

  const skills = treeData[currentTab]['skills'].map((skill) => {
    return (
      <Skill
          {...skill}
          lvl={skillLevels[skill.skillName] || 0}
          key={skill.skillName}
          setSkillLevel={setSkillLevel}
          setCurrentSkill={props.setCurrentSkill}
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
      <Tab id={1} treeName={treeData[1]['treeName']} setTab={props.setTab}/>
      <Tab id={2} treeName={treeData[2]['treeName']} setTab={props.setTab}/>
      <Tab id={3} treeName={treeData[3]['treeName']} setTab={props.setTab}/>
    </div>
  );
};

export default Tree;
