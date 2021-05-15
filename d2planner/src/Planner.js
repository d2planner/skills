import './Planner.css'
import Tooltip from './Tooltip';
import Tree from './Tree';

function Planner() {
  return (
    <div className='plannerContainer'>
      <Tooltip />
      <Tree />
    </div>
  );
}

export default Planner;