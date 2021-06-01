import calculateSkillValue from './calculateSkillValue'

const lvlBreakpoints = [[0, 1], [1, 8], [8, 16], [16, 22], [22, 28], [28, null]];


function calculatePhysicalDamageMin (skill, lvl, skillLevels, missileNum=null) {
  return calculateDamage(skill, lvl, skillLevels, 'minDam', 'minLevDam', 'dmgSymPerCalc');
}

function calculatePhysicalDamageMax (skill, lvl, skillLevels, missileNum=null) {
  return calculateDamage(skill, lvl, skillLevels, 'maxDam', 'maxLevDam', 'dmgSymPerCalc');
}

function calculateElementalDamageMin (skill, lvl, skillLevels, missileNum=null) {
  return calculateDamage(skill, lvl, skillLevels, 'eMin', 'eMinLev', 'eDmgSymPerCalc');
}

function calculateElementalDamageMax (skill, lvl, skillLevels, missileNum=null) {
  return calculateDamage(skill, lvl, skillLevels, 'eMax', 'eMaxLev', 'eDmgSymPerCalc');
}

function calculateDamage (
  skill,
  lvl,
  skillLevels,
  initialDamageKey,
  damagePerLevelKeyRoot,
  synergyKey,
  missileNum=null,
) {
  if (missileNum) {
    skill = skill[`missile${missileNum}`];
  }

  const synergyBonus = calculateSkillValue(skill[synergyKey], skill, lvl, skillLevels) || 0;
  const synergyMultiplier = (100 + synergyBonus) / 100;

  let damage = skill[initialDamageKey];
  for (let i = 0; i <= lvlBreakpoints.length; i++) {
    const [lower, upper] = lvlBreakpoints[i];
    if (lvl <= lower) {
      break;
    }
    const damagePerLevel = skill[`${damagePerLevelKeyRoot}${i}`] || 0;
    const lvlForBand = (upper !== null) ? Math.min(upper, lvl) : lvl;
    damage += (lvlForBand - lower) * damagePerLevel;
  }
  const hitShift = skill.hitShift || 0;
  return damage * synergyMultiplier * 2 ** (hitShift - 8);
}

export {
  calculatePhysicalDamageMin,
  calculatePhysicalDamageMax,
  calculateElementalDamageMin,
  calculateElementalDamageMax,
};
export default calculateDamage;
