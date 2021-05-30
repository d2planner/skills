import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import skillData from './assets/1.14D/game_data/d2_skill_data.json';
import Tooltip from './Tooltip'

describe('<Tooltip />', () => {
  const plannerState = {
    character: 'amazon',
    currentTab: 1,
    currentSkill: 'magicArrow',
    ...Object.keys(skillData.skillDetails).reduce((o, key) => ({ ...o, [`${key}Level`]: 0}), {}),
  }

  it('renders magic arrow', () => {
    render(<Tooltip
      skill={skillData.skillDetails['magicArrow']}
      lvl={plannerState['magicArrowLevel']}
      plannerState={plannerState}
    />);
  });

  it('renders all skills', () => {
    Object.entries(skillData.skillDetails).forEach(([skillName, skill]) => {
      render(<Tooltip
        skill={skill}
        lvl={plannerState[`${skillName}Level`]}
        plannerState={plannerState}
      />);
    });
  });
});
