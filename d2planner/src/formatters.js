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
  2: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta} ${calcA}${tb}`), precision: 1}),
  3: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}${calcA}${tb}`), precision: 1}),
  4: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}+${calcA}`)}),
  5: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta} ${calcA}`), precison: 1}),
  6: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`+${calcA} ${ta}`)}),
  7: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${calcA} ${ta}`)}),
  8: formatAttackRating,
  9: formatPhysicalDamage,
  10: formatElementalDamage,
  11: formatElementalLength,
  12: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta}${calcA} seconds`), frames: true, precison: 10}),
  13: formatMinionLife,
  14: formatPoisonDamage,
  // 15: (skill, lvl, skillLevels, ta, tb, ca, cb) => (`${ta}:${tb}`),
  16: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`Duration: ${calcA}-${calcB} seconds`), frames: true}),
  17: formatElementalDamageOverTimeWithText,

  66: createFillTaWithCalcAFormatter('%d%'),
};

function formatManaCost (skill, lvl, skillLevels, ta, tb, ca, cb) {
  const cost = floor(calculateManaCost(skill, lvl, skillLevels), ca || 10);
  return cost ? `${skill.strMana}${cost}` : null;
}

function formatAttackRating (skill, lvl, skillLevels, ta, tb, ca, cb) {
  const attackRating = calculateToHit(skill, lvl, skillLevels);
  if (attackRating === undefined) {
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

function formatElementalDamage (skill, lvl, skillLevels, ta, tb, ca, cb) {
  if (skill.eMin === undefined) {
    return null;
  }
  const minDamage = floor(calculateElementalDamageMin(skill, lvl, skillLevels));
  const maxDamage = floor(calculateElementalDamageMax(skill, lvl, skillLevels));

  if (minDamage === maxDamage) {
    return `${skill.eType} Damage: +${minDamage}`
  }
  return `${skill.eType} Damage: ${minDamage}-${maxDamage}`
}

function formatElementalDamageOverTimeWithText (skill, lvl, skillLevels, ta, tb, ca, cb) {
  const calcA = floor(calculateSkillValue(ca, skill, lvl, skillLevels));
  const calcB = floor(calculateSkillValue(cb, skill, lvl, skillLevels));
  return `${tb}${ta}${calcA}-${calcB} per second`
}

function formatElementalLength (skill, lvl, skillLevels, ta, tb, ca, cb) {
  if (skill.eLen === undefined) {
    return null;
  }
  const length = calculateLength(skill, lvl, skillLevels) / framesPerSecond;
  return `${skill.eType} Length: ${length} seconds`;
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

function formatMinionLife (skill, lvl, skillLevels, ta, tb, ca, cb) {
  const baseLife = (skill.summon.minHPNormal + skill.summon.maxHPNormal) / 2;
  const calcA = calculateSkillValue(ca, skill, lvl, skillLevels) || 0;
  const calcB = calculateSkillValue(cb, skill, lvl, skillLevels) || 0;
  const life = floor((1 + calcA / 100) * (baseLife + calcB));
  return `Life: ${life}`;
}

function createFillTaWithCalcAFormatter (pattern) {
  function formatter (skill, lvl, skillLevels, ta, tb, ca, cb) {
    const calcA = calculateSkillValue(ca, skill, lvl, skillLevels);
    return ta.replace(pattern, calcA);
  }
  return formatter;
}

function createCalcFormatter ({template, frames=false, gameUnits=false, precision=null, multiplier=null}={}) {
  function formatter (skill, lvl, skillLevels, ta, tb, ca, cb) {
    let calcA = calculateSkillValue(ca, skill, lvl, skillLevels);
    let calcB = calculateSkillValue(cb, skill, lvl, skillLevels);

    calcA = convertCalc(calcA, frames, gameUnits, precision, multiplier);
    calcB = convertCalc(calcB, frames, gameUnits, precision, multiplier);
    return (calcA || calcB) ? template(ta, tb, calcA, calcB) : null;
  }
  return formatter;
}

function convertCalc (calc, frames, gameUnits, precision, multiplier) {
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
    return calc;
}

function floor (x, precision=null) {
  if (precision === null) {
    return Math.floor(x);
  }
  return Math.floor(precision * x) / precision;
}

export default formattersByDescline;
