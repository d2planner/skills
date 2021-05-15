import './Tree.css';
import Tab from './Tab.js'
import images from './assets/game_images'

const Tree = (props) => {
  const {character, currentTab, setTab} = props
  return (
    <div className='treeContainer'>
      <img
        className='tree'
        src={images[`${character}Tree${currentTab}`]}
        alt='Skill Tree'
      />
      <button className='skill'></button>

      <Tab id={1} setTab={setTab}/>
      <Tab id={2} setTab={setTab}/>
      <Tab id={3} setTab={setTab}/>
    </div>
  );
}

export default Tree;