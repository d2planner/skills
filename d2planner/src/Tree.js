import './Tree.css';
import Skill from './Skill'
import Tab from './Tab';
import images from './assets/1.14D/game_images';

const Tree = (props) => {
  const {skillLevels, skillBonuses, treeData, character, currentTab} = props;

  const setSkillLevel = createSkillLevelSetter(character, skillLevels, props.setSkillLevels);
  const setBonusLevel = createSkillLevelSetter(character, skillBonuses, props.setSkillBonuses);
  const skills = treeData[currentTab]['skills'].map((skill) => (
    <Skill
        {...skill}
        lvl={skillLevels[skill.skillName] || 0}
        key={skill.skillName}
        setSkillLevel={setSkillLevel}
        setCurrentSkill={props.setCurrentSkill}
    />
  ));
  const tabs = [1, 2, 3].map((id) => (
    <Tab key={id} id={id} treeName={treeData[id]['treeName']} setTab={props.setTab}/>
  ))
  return (
    <div className='treeContainer'>
      <img
        className='tree'
        src={images[`${character}Tree${currentTab}`]}
        alt='Skill Tree'
      />
      {skills}
      {tabs}
    </div>
  );
};

function createSkillLevelSetter (character, skillLevels, setStateFunction) {
  function setter (skillName, lvl) {
    lvl = Math.floor(Number(lvl));
    if (!(lvl >= 0)) {
      return
    } 
    if (lvl === 0) {
      let skillLevelsNew = {...skillLevels};
      delete skillLevelsNew[skillName]
      setStateFunction(character, skillLevelsNew);
      return
    }
    setStateFunction(character, { ...skillLevels, [skillName]: lvl});
  }
  return setter;
}

export default Tree;
