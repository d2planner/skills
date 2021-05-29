import { createLinearCalculator, createParamCalculator } from './calculators'

describe('linear calculators', () => {
  test('ln12 calc type', () => {
    const skill = {'params': {'par1': 10, 'par2': 2}};
    const calculator = createLinearCalculator('par1', 'par2');
    expect(
      calculator(skill, 5, {})
    ).toBe(18);
  });
  test('ln34 calc type', () => {
    const skill = {'params': {'par3': 50, 'par4': 1}};
    const calculator = createLinearCalculator('par3', 'par4');
    expect(
      calculator(skill, 3, {})
    ).toBe(52);
  });
  test('missing parameter', () => {
    const skill = {'params': {'par1': 5}};
    const calculator = createLinearCalculator('par1', 'par2');
    expect(
      calculator(skill, 10, {})
    ).toBe(5);
  });
});

describe('param calculators', () => {
  const skill = {'params': {'par1': 10, 'par2': 3}};
  test('simple get params', () => {
    expect(
      createParamCalculator(1)(skill, 1, {})
    ).toBe(10);
    expect(
      createParamCalculator(2)(skill, 1, {})
    ).toBe(3);
  });
  test('missing param', () => {
    expect(
      createParamCalculator(5)(skill, 1, {})
    ).toBe(undefined);
  });
});
