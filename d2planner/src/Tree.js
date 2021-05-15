import './Tree.css';
import amazonTreeImage from './assets/game_images/amazon_tree_1.jpg';

function Tree() {
  return (
    <div className='treeContainer'>
      <img className='tree' src={amazonTreeImage} alt='Skill Tree'/>
      <button className='skill'></button>
    </div>
  );
}

export default Tree;