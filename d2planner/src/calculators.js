import calculateSkillValue from './calculateSkillValue';
import {calculateElementalDamageMin, calculateElementalDamageMax} from './damageCalculators';

const lengthLvlBreakpoints = [[0, 1], [1, 8], [8, 16]];
const framesPerSecond = 25;

const calcLookup = {
  toht: calculateToHit,
  edmn: calculateElementalDamageMin,
  edmx: calculateElementalDamageMax,
  edln: calculateLength,
  edns: (skill, lvl, skillLevels) => (256 * calculateElementalDamageMin(skill, lvl, skillLevels)),
  edxs: (skill, lvl, skillLevels) => (256 * calculateElementalDamageMax(skill, lvl, skillLevels)),
  ln12: createLinearCalculator('par1', 'par2'),
  ln34: createLinearCalculator('par3', 'par4'),
  ln56: createLinearCalculator('par5', 'par6'),
  ln78: createLinearCalculator('par7', 'par8'),
  dm12: createDiminishingCalculator('par1', 'par2'),
  dm34: createDiminishingCalculator('par3', 'par4'),
  dm56: createDiminishingCalculator('par5', 'par6'),
  dm78: createDiminishingCalculator('par7', 'par8'),
  math: createMasteryCalculator('passiveMasteryTh'),
  madm: createMasteryCalculator('passiveMasteryDmg'),
  macr: createMasteryCalculator('passiveMasteryCrit'),
  mps: calculateManaCostPerSecond,
  len: createCalculatorOnCalcField('auraLen'),
  usmc: (skill, lvl, skillLevels) => (calculateManaCost(skill, lvl, skillLevels, 256)),
  par1: createParamCalculator(1),
  par2: createParamCalculator(2),
  par3: createParamCalculator(3),
  par4: createParamCalculator(4),
  par5: createParamCalculator(5),
  par6: createParamCalculator(6),
  par7: createParamCalculator(7),
  par8: createParamCalculator(8),
  clc1: createCalculatorOnCalcField('calc1'),
  clc2: createCalculatorOnCalcField('calc2'),
  clc3: createCalculatorOnCalcField('calc3'),
  clc4: createCalculatorOnCalcField('calc4'),
  lvl: (skill, lvl, skillLevels) => (lvl),
};

function calculateToHit (skill, lvl, skillLevels) {
  const toHitExpression = skill.toHitCalc;
  if (toHitExpression) {
    return calculateSkillValue(toHitExpression, skill, lvl, skillLevels);
  }
  return (skill.toHit || 0) + (skill.levToHit || 0) * (lvl - 1);
}

function calculateManaCostPerSecond (skill, lvl, skillLevels) {
  return calculateManaCost(skill, lvl, skillLevels) * framesPerSecond / 2;
}

function calculateManaCost (skill, lvl, skillLevels, multiplier=null) {
  const mana = skill.mana;
  const lvlMana = skill.lvlMana || 0;
  const manaShift = skill.manaShift;
  let cost = (mana + lvlMana * (lvl - 1)) * 2 ** (manaShift - 8);
  if (multiplier !== null) {
    cost *= multiplier;
  }
  return Math.max(cost, skill.minMana || 0);
}

function calculateLength (skill, lvl, skillLevels) {
  const synergyBonus = calculateSkillValue(skill.eLenSymPerCalc, skill, lvl, skillLevels) || 0;
  const synergyMultipler = (100 + synergyBonus) / 100;

  let length = skill.eLen;
  for (let i = 0; i <= lengthLvlBreakpoints.length; i++) {
    const [lower, upper] = lengthLvlBreakpoints[i];
    if (lvl <= lower) {
      break;
    }
    const lengthPerLevel = skill[`eLevLen${i}`] || 0;
    const lvlForBand = Math.min(upper, lvl);
    length += (lvlForBand - lower) * lengthPerLevel;
  }
  return length * synergyMultipler;
}

function createLinearCalculator (paramKeyA, paramKeyB) {
  function calculator (skill, lvl, skillLevels) {
    const a = skill.params[paramKeyA] || 0;
    const b = skill.params[paramKeyB] || 0;
    return a + b * (lvl - 1);
  }
  return calculator;
}

function createDiminishingCalculator (paramKeyA, paramKeyB) {
  function calculator (skill, lvl, skillLevels) {
    const a = skill.params[paramKeyA] || 0;
    const b = skill.params[paramKeyB] || 0;
    return Math.floor(a + ((110 * lvl) * (b - a)) / (100 * (lvl + 6)));
  }
  return calculator;
}

function createCalculatorOnCalcField (calcField) {
  return (skill, lvl, skillLevels) => (calculateSkillValue(skill.calcs[calcField], skill, lvl, skillLevels));
}

function createMasteryCalculator (masteryKey) {
  return (skill, lvl, skillLevels) => (calculateSkillValue(skill.mastery[masteryKey], skill, lvl, skillLevels));
}

function createParamCalculator (paramNumber) {
  function calculator (skill, lvl, skillLevels) {
    return skill.params[`par${paramNumber}`];
  }
  return calculator;
}

export {
  calculateManaCost,
  calculateManaCostPerSecond,
  calculateLength,
  calculateToHit,
  createLinearCalculator,
  createParamCalculator,
  framesPerSecond,
};
export default calcLookup;
