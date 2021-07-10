import { createLinearCalculator } from './calculators';
import calculateSkillValue, { getTotalLevel } from './calculateSkillValue';

const lvlBreakpoints = [[0, 1], [1, 8], [8, 16], [16, 22], [22, 28], [28, null]];

function calculatePhysicalDamageMin (skill, lvl, skillLevels, skillBonuses, missileNum=null) {
  return calculateDamage(skill, lvl, skillLevels, skillBonuses, 'minDam', 'minLevDam', 'dmgSymPerCalc');
}

function calculatePhysicalDamageMax (skill, lvl, skillLevels, skillBonuses, missileNum=null) {
  return calculateDamage(skill, lvl, skillLevels, skillBonuses, 'maxDam', 'maxLevDam', 'dmgSymPerCalc');
}

function calculateElementalDamageMin (skill, lvl, skillLevels, skillBonuses, missileNum=null) {
  if (isLightningMin(skill)) {
    return 1;
  }
  return calculateDamage(skill, lvl, skillLevels, skillBonuses, 'eMin', 'eMinLev', 'eDmgSymPerCalc', missileNum);
}

function calculateElementalDamageMax (skill, lvl, skillLevels, skillBonuses, missileNum=null) {
  return calculateDamage(skill, lvl, skillLevels, skillBonuses, 'eMax', 'eMaxLev', 'eDmgSymPerCalc', missileNum);
}

function calculateDamage (
  skill,
  lvl,
  skillLevels,
  skillBonuses,
  initialDamageKey,
  damagePerLevelKeyRoot,
  synergyKey,
  missileNum=null,
) {
  if (missileNum) {
    skill = skill[`missile${missileNum}`];
  }

  const synergyBonus = calculateSkillValue(skill[synergyKey], skill, lvl, skillLevels, skillBonuses) || 0;
  const synergyMultiplier = (100 + synergyBonus) / 100;

  const masteryBonus = getElementalMasteryBonus(skill, lvl, skillLevels, skillBonuses) || 0;
  const masteryMultiplier = (100 + masteryBonus) / 100;

  let damage = skill[initialDamageKey];
  for (let i = 0; i < lvlBreakpoints.length; i++) {
    const [lower, upper] = lvlBreakpoints[i];
    if (lvl <= lower) {
      break;
    }
    const damagePerLevel = skill[`${damagePerLevelKeyRoot}${i}`] || 0;
    const lvlForBand = (upper !== null) ? Math.min(upper, lvl) : lvl;
    damage += (lvlForBand - lower) * damagePerLevel;
  }
  const hitShift = skill.hitShift || 0;
  return damage * synergyMultiplier * masteryMultiplier * 2 ** (hitShift - 8);
}

function getElementalMasteryBonus (skill, lvl, skillLevels, skillBonuses) {
  if (!['Lightning', 'Fire'].includes(skill.eType) || !skill.relatedSkills) {
    return 0;
  }
  const mastery = skill.relatedSkills[`${skill.eType.toLowerCase()}Mastery`];
  if (!mastery) {
    return 0;
  }
  const masteryLvl = getTotalLevel(mastery, skillLevels, skillBonuses)
  if (masteryLvl < 1) {
    return 0;
  }
  const calculator = createLinearCalculator('par1', 'par2');
  return calculator(mastery, masteryLvl, skillLevels, skillBonuses);
}

const isLightningMin = skill => (
  (skill.eType === "Lightning")
  && (skill.eMin === 1)
  && !(skill.eMinLev1 > 0)
  && !(skill.eMinLev2 > 0)
  && !(skill.eMinLev3 > 0)
  && !(skill.eMinLev4 > 0)
  && !(skill.eMinLev5 > 0)
);


export {
  calculatePhysicalDamageMin,
  calculatePhysicalDamageMax,
  calculateElementalDamageMin,
  calculateElementalDamageMax,
};
export default calculateDamage;
