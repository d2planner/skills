import calculateSkillValue from './calculateSkillValue'
import {
  calculateLength,
  calculateManaCost,
  calculateToHit,
  framesPerSecond,
} from './calculators'
import {
  calculatePhysicalDamageMin,
  calculatePhysicalDamageMax,
  calculateElementalDamageMin,
  calculateElementalDamageMax,
} from './damageCalculators';

const yardsPerGameUnit = 2 / 3;

// Commented values are not used in 1.14D
// these should be uncommented and tested if used in other patches
const formattersByDescline = {
  1: formatManaCost,
  2: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta} ${calcA}${tb}`), precision: 1, signed: true}),
  3: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}${calcA}${tb}`), precision: 1}),
  4: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}+${calcA}`)}),
  5: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta} ${calcA}`), precision: 1}),
  6: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`+${calcA} ${ta}`)}),
  7: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${calcA} ${ta}`)}),
  8: formatAttackRating,
  9: formatPhysicalDamage,
  10: formatElementalDamage,
  11: formatElementalLength,
  12: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}${calcA} seconds`), frames: true, precision: 10}),
  13: formatMinionLife,
  14: formatPoisonDamage,
  // 15: (skill, lvl, skillLevels, ta, tb, ca, cb) => (`${ta || ''}:${tb || ''}`),
  16: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`Duration: ${calcA}-${calcB} seconds`), frames: true}),
  17: formatElementalDamageOverTimeWithText,
  18: (skill, lvl, skillLevels, ta, tb, ca, cb) => (ta || ''),
  19: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${tb}${ta} ${calcA} yards`), gameUnits: true, precision: 10}),
  // 20: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}+${calcA} percent ${tb}`)}),
  // 21: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}${calcA} percent ${tb}`)}),
  22: formatFireMissileDamageOverTime,
  23: formatMissileDuration,
  24: formatElementalDamageWithText,
  25: (skill, lvl, skillLevels, ta, tb, ca, cb) => (`${ta || ''}${tb || ''}`),
  26: formatElementalDamageOverTime,
  27: formatFireDamageOverTime,
  28: (skill, lvl, skillLevels, ta, tb, ca, cb) => ('Radius: 1 yard'),
  29: formatMissileRangeInYards,
  30: formatClientSubmissileDuration,
  31: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta} ${calcA} seconds`), frames: true, precision: 10}),
  32: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}${tb}+${calcA} percent`)}),
  33: (skill, lvl, skillLevels, ta, tb, ca, cb) => (`${ta || ''}${tb || ''}`),
  34: formatSkeletonDamage,
  35: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}: ${calcA}-${calcB}`), precision: 1}),
  36: formatTextOnCalcCondition,
  37: formatHalfRadius,
  38: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}${calcA}-${calcB}${tb}`), precision: 1}),
  39: formatGolemDamage,
  40: (skill, lvl, skillLevels, ta, tb, ca, cb) => (ta.replace(/%s/, tb)),
  41: formatFireGolemDamage,
  42: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}: +${calcA}.${calcB} ${tb}`), precision: 1}),
  43: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}${calcA}-${calcB}${tb}`), precision: 10, multiplier: 1/256}),
  // 44: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}${calcA}-${calcB}${tb}`), precision: 10, multiplier: 1/256}),
  // 45: 
  // 46: (skill, lvl, skillLevels, ta, tb, ca, cb) => (ta || ''),
  47: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}${calcA}-${calcB}`), precision: 1}),
  48: formatElementalDamage,
  49: formatPhysicalDamageWithText,
  50: formatMissileDamage,
  51: createFillTaWithCalcAFormatter('%d'),
  52: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}+${calcA}-${calcB}${tb}`), precision: 1}),
  // 53:
  // 54:
  // 55:
  // 56:
  57: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}+${calcA} seconds`), frames: true, precision: 1}),
  // 58: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}${tb}+${calcA}-${calcB}`), precision: 1}),
  59: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${tb}${ta}${calcA}-${calcB}`), precision: 1}),
  // 60: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}+${calcB}${tb}`), precision=1, multiplier: 1/256}),
  61: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}${calcA}${tb}`), precision: 10, multiplier: 1/256}),
  62: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}${tb}${calcA}-${calcB}`), precision: 1}),
  63: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}: +${calcA}% ${tb}`)}),
  // 64: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}: +${calcA}/${calcB} ${tb}`), precision: 1}),
  // 65: (skill, lvl, skillLevels, ta, tb, ca, cb) => (`${ta || ''}: ${tb || ''}`),
  66: createFillTaWithCalcAFormatter('%d%'),
  67: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}: +${calcA} ${tb}`), precision: 1}),
  68: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${calcA}${ta}${tb}`)}),
  // 69: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}: ${tb} ${calcA}`)}),
  70: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}${tb}+${calcA}`)}),
  71: createFillTbWithCalcAFormatter('%d'),
  72: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`+${calcA}/${calcB} ${ta}`)}),
  73: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${calcA}/${calcB} ${ta}`)}),
  // 74: (skill, lvl, skillLevels, ta, tb, ca, cb) => (ta || ''),
  // 75: (skill, lvl, skillLevels, ta, tb, ca, cb) => (ta || ''),
};

function formatManaCost (skill, lvl, skillLevels, ta, tb, ca, cb) {
  const cost = floor(calculateManaCost(skill, lvl, skillLevels), ca || 10);
  return cost ? `${skill.strMana}${cost}` : null;
}

function formatAttackRating (skill, lvl, skillLevels, ta, tb, ca, cb) {
  const attackRating = calculateToHit(skill, lvl, skillLevels);
  if (!attackRating) {
    return null;
  }
  return `Attack +${attackRating} percent`;
}

function formatPhysicalDamage (skill, lvl, skillLevels, ta, tb, ca, cb) {
  if (skill.minDam === undefined) {
    return null;
  }
  const minDamage = floor(calculatePhysicalDamageMin(skill, lvl, skillLevels));
  const maxDamage = floor(calculatePhysicalDamageMax(skill, lvl, skillLevels));

  if (minDamage === maxDamage) {
    return `Damage: +${minDamage}`
  }
  return `Damage: ${minDamage}-${maxDamage}`
}

function formatPhysicalDamageWithText (skill, lvl, skillLevels, ta, tb, ca, cb) {
  if (skill.minDam === undefined) {
    return null;
  }
  const minDamage = floor(calculatePhysicalDamageMin(skill, lvl, skillLevels));
  const maxDamage = floor(calculatePhysicalDamageMax(skill, lvl, skillLevels));
  return `${tb || ''}${ta || ''} ${minDamage}-${maxDamage}`;
}

function formatElementalDamage (skill, lvl, skillLevels, ta, tb, ca, cb) {
  if (skill.eMin === undefined) {
    return null;
  }
  const minDamage = floor(calculateElementalDamageMin(skill, lvl, skillLevels));
  const maxDamage = floor(calculateElementalDamageMax(skill, lvl, skillLevels));

  if (minDamage === maxDamage) {
    return `${skill.eType} Damage: +${minDamage}`;
  }
  return `${skill.eType} Damage: ${minDamage}-${maxDamage}`;
}

function formatElementalDamageWithText (skill, lvl, skillLevels, ta, tb, ca, cb) {
  if (skill.eMin === undefined) {
    return null;
  }
  const minDamage = floor(calculateElementalDamageMin(skill, lvl, skillLevels));
  const maxDamage = floor(calculateElementalDamageMax(skill, lvl, skillLevels));
  return `${tb || ''}${ta || ''} ${minDamage}-${maxDamage}`;
}

function formatFireDamageOverTime (skill, lvl, skillLevels, ta, tb, ca, cb) {
  const adjustment = 2.34 * 2 ** 5  // tuned, just higher than 7/3
  const minDamage = floor(adjustment * calculateElementalDamageMin(skill, lvl, skillLevels));
  const maxDamage = floor(adjustment * calculateElementalDamageMax(skill, lvl, skillLevels));
  return `Average Fire Damage: ${minDamage}-${maxDamage} per second`;
}

function formatElementalDamageOverTime (skill, lvl, skillLevels, ta, tb, ca, cb) {
  const minDamage = floor(framesPerSecond * calculateElementalDamageMin(skill, lvl, skillLevels));
  const maxDamage = floor(framesPerSecond * calculateElementalDamageMax(skill, lvl, skillLevels));
  return `Average ${skill.eType} Damage: ${minDamage}-${maxDamage} per second`;
}

function formatElementalDamageOverTimeWithText (skill, lvl, skillLevels, ta, tb, ca, cb) {
  const calcA = floor(calculateSkillValue(ca, skill, lvl, skillLevels));
  const calcB = floor(calculateSkillValue(cb, skill, lvl, skillLevels));
  return `${tb}${ta}${calcA}-${calcB} per second`;
}

function formatElementalLength (skill, lvl, skillLevels, ta, tb, ca, cb) {
  if (skill.eLen === undefined) {
    return null;
  }
  const length = calculateLength(skill, lvl, skillLevels) / framesPerSecond;
  return `${skill.eType} Length: ${length} seconds`;
}

function formatHalfRadius (skill, lvl, skillLevels, ta, tb, ca, cb) {
  const calcA = calculateSkillValue(ca, skill, lvl, skillLevels);
  const radius = floor(floor(calcA) * yardsPerGameUnit / 2, 10);
  return `${ta}${radius} yards`;
}

function formatPoisonDamage (skill, lvl, skillLevels, ta, tb, ca, cb) {
  if (skill.eMin === undefined) {
    return null;
  }
  const length = calculateLength(skill, lvl, skillLevels);
  const minDamage = floor(length * calculateElementalDamageMin(skill, lvl, skillLevels));
  const maxDamage = floor(length * calculateElementalDamageMax(skill, lvl, skillLevels));
  const formattedLength = length / framesPerSecond;
  return `Poison Damage : ${minDamage}-${maxDamage}\nover ${formattedLength} seconds`;
}

function formatMissileDamage (skill, lvl, skillLevels, ta, tb, ca, cb) {
  const missile = skill.missile1;
  const minDamage = floor(calculateElementalDamageMin(missile, lvl, skillLevels));
  const maxDamage = floor(calculateElementalDamageMax(missile, lvl, skillLevels));
  return `${ta}${minDamage}-${maxDamage}`;
}

function formatFireMissileDamageOverTime (skill, lvl, skillLevels, ta, tb, ca, cb) {
  const adjustment = 2.34 * 2 ** 5;  // tuned, just higher than 7/3
  const minDamage = floor(adjustment * calculateElementalDamageMin(skill, lvl, skillLevels, 1));
  const maxDamage = floor(adjustment * calculateElementalDamageMax(skill, lvl, skillLevels, 1));
  return `Average Fire Damage: ${minDamage}-${maxDamage} per second`;
}

function formatMissileDuration (skill, lvl, skillLevels, ta, tb, ca, cb) {
  const duration = skill.missile1.range + (skill.missile1.levRange || 0) * (lvl - 1);
  const formattedDuration = duration / framesPerSecond;
  return `${ta}${formattedDuration} seconds`;
}

function formatClientSubmissileDuration (skill, lvl, skillLevels, ta, tb, ca, cb) {
  const missile = skill.missile1.cltSubMissile1;
  const duration = missile.range + (missile.levRange || 0) * (lvl - 1);
  const formattedDuration = duration / framesPerSecond;
  return `${ta}${formattedDuration} seconds`;
}

function formatMissileRangeInYards (skill, lvl, skillLevels, ta, tb, ca, cb) {
  const missileRange = skill.missile1.range + (skill.missile1.levRange || 0) * (lvl - 1);
  const formattedRange = floor(missileRange * yardsPerGameUnit, 10);
  return `${formattedRange} yards`;
}

function formatMinionLife (skill, lvl, skillLevels, ta, tb, ca, cb) {
  const baseLife = (skill.summon.minHPNormal + skill.summon.maxHPNormal) / 2;
  const calcA = calculateSkillValue(ca, skill, lvl, skillLevels) || 0;
  const calcB = calculateSkillValue(cb, skill, lvl, skillLevels) || 0;
  const life = floor((1 + calcA / 100) * (baseLife + calcB));
  return `Life: ${life}`;
}

function formatSkeletonDamage (skill, lvl, skillLevels, ta, tb, ca, cb) {
  const masteryDamage = skillLevels.skeletonMasteryLevel * skill.relatedSkills.skeletonMastery.params.par2;

  const monsterMinDamage = skill.summon.a1MinDNormal;
  const monsterMaxDamage = skill.summon.a1MaxDNormal;

  const skillDamage = calculateElementalDamageMin(skill, lvl, skillLevels);
  const bonus = (lvl > 3) ? (lvl - 3) * skill.params.par3 : 0;
  const multiplier = 1 + bonus / 100;

  const minDamage = floor(multiplier * (monsterMinDamage + skillDamage + masteryDamage));
  const maxDamage = floor(multiplier * (monsterMaxDamage + skillDamage + masteryDamage));
  return `Damage: ${minDamage}-${maxDamage}`;
}

function formatGolemDamage (skill, lvl, skillLevels, ta, tb, ca, cb) {
  const damageBonus = (skill.strName === 'Iron Golem') ? 0 : 35 * (lvl - 1);
  const damageMultiplier = 1 + damageBonus / 100;

  const monsterMinDamage = skill.summon.a1MinDNormal;
  const monsterMaxDamage = skill.summon.a1MaxDNormal;

  const minDamage = floor(damageMultiplier * monsterMinDamage);
  const maxDamage = floor(damageMultiplier * monsterMaxDamage);
  return `Damage: ${minDamage}-${maxDamage}`;
}

function formatFireGolemDamage (skill, lvl, skillLevels, ta, tb, ca, cb) {
  const monsterMinDamage = skill.summon.a1MinDNormal;
  const monsterMaxDamage = skill.summon.a1MaxDNormal;

  const holyFireMinDamage = calculateSkillValue(ca, skill, lvl, skillLevels);
  const holyFireMaxDamage = calculateSkillValue(cb, skill, lvl, skillLevels);

  const minDamage = floor(monsterMinDamage + holyFireMinDamage);
  const maxDamage = floor(monsterMaxDamage + holyFireMaxDamage);
  return `Fire Damage: ${minDamage}-${maxDamage}`;
}

function formatTextOnCalcCondition (skill, lvl, skillLevels, ta, tb, ca, cb) {
  const calcA = floor(calculateSkillValue(ca, skill, lvl, skillLevels));
  return (calcA === 1) ? `${calcA}${ta}` : `${calcA}${tb}`
}

function createFillTaWithCalcAFormatter (pattern) {
  function formatter (skill, lvl, skillLevels, ta, tb, ca, cb) {
    const calcA = calculateSkillValue(ca, skill, lvl, skillLevels);
    return ta.replace(pattern, calcA);
  }
  return formatter;
}

function createFillTbWithCalcAFormatter (pattern) {
  function formatter (skill, lvl, skillLevels, ta, tb, ca, cb) {
    const calcA = calculateSkillValue(ca, skill, lvl, skillLevels);
    return tb.replace(pattern, calcA);
  }
  return formatter;
}

function createCalcFormatter (
  {template, frames=false, gameUnits=false, signed=false, precision=null, multiplier=null}={}
) {
  function formatter (skill, lvl, skillLevels, ta, tb, ca, cb) {
    let calcA = calculateSkillValue(ca, skill, lvl, skillLevels);
    let calcB = calculateSkillValue(cb, skill, lvl, skillLevels);

    calcA = convertCalc(calcA, frames, gameUnits, signed, precision, multiplier);
    calcB = convertCalc(calcB, frames, gameUnits, signed, precision, multiplier);
    return (calcA || calcB) ? template(ta || '', tb || '', calcA, calcB) : null;
  }
  return formatter;
}

function convertCalc (calc, frames, gameUnits, signed, precision, multiplier) {
    if (calc === undefined) {
      return calc;
    }
    if (frames) {
      calc /= framesPerSecond;
    }
    if (gameUnits) {
      calc = floor(calc) * yardsPerGameUnit;
    }
    if (multiplier !== null) {
      calc *= multiplier;
    }
    if (precision !== null) {
      calc = floor(calc, precision);
    }
    if (signed && (calc > 0)) {
      calc = '+' + calc
    }
    return calc;
}

function floor (x, precision=null) {
  if (precision === null) {
    return Math.floor(x);
  }
  return Math.floor(precision * x) / precision;
}

export default formattersByDescline;
