import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import skillData from './assets/1.14D/game_data/d2_skill_data.json';
import { getAllCharacterSkillLevels } from './Planner';
import Tooltip from './Tooltip';

describe('<Tooltip />', () => {

  it('renders immolation arrow', () => {
    render(<Tooltip
      skill={skillData.skillDetails['immolationArrow']}
      skillName='immolationArrow'
      skillBonuses={{'all': 5}}
      skillLevels={{'fireArrowLevel': 10, 'explodingArrowLevel': 5}}
      difficulty={'Nightmare'}
    />);
  });

  it('renders all skills', () => {
    Object.entries(skillData.skillDetails).forEach(([skillName, skill]) => {
      render(<Tooltip
        skill={skill}
        skillName={skillName}
        skillBonuses={{'all': 1}}
        skillLevels={{[skillName]: 10}}
        difficulty={'Normal'}
      />);
      expect(screen.queryByText(/undefined/)).toBeNull();
      expect(screen.queryByText(/NaN/)).toBeNull();
      expect(screen.queryByText(/MISSING FORMATTER/)).toBeNull();
    });
  });
});
