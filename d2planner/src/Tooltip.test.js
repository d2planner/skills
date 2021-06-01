import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import skillData from './assets/1.14D/game_data/d2_skill_data.json';
import Tooltip from './Tooltip'


let skillLevels = {}
Object.keys(skillData.skillDetails).forEach((skillName) => {
  skillLevels[`${skillName}Level`] = 0
});


describe('<Tooltip />', () => {
  const plannerState = {
    character: 'amazon',
    currentTab: 1,
    currentSkill: 'magicArrow',
    ...skillLevels,
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
      expect(screen.queryByText(/undefined/)).toBeNull();
      expect(screen.queryByText(/NaN/)).toBeNull();
      expect(screen.queryByText(/MISSING FORMATTER/)).toBeNull();
    });
  });
});
