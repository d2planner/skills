import './Tree.css';
import Tab from './Tab.js'
import images from './assets/1.14D/game_images'

const Tree = (props) => {
  const {character, treeData, currentTab, setTab} = props
  const skills = treeData[character][currentTab].map((skill) => {
    return <Skill {...skill} points={14} key={skill.skillName} />
  })
  return (
    <div className='treeContainer'>
      <img
        className='tree'
        src={images[`${character}Tree${currentTab}`]}
        alt='Skill Tree'
      />
      {skills}
      <Tab id={1} setTab={setTab}/>
      <Tab id={2} setTab={setTab}/>
      <Tab id={3} setTab={setTab}/>
    </div>
  );
}

const Skill = (props) => {
  const {row, column, skillName} = props
  return (
    <div className={`skillContainer row${row} column${column}`}>
      <button className='skill'></button>
      <p className='skillPoints'>{props.points}</p>
    </div>
  )
}

export default Tree;