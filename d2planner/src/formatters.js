import calculateSkillValue from './calculateSkillValue'
import { calculateToHit } from './calculators'
import {
  calculatePhysicalDamageMin,
  calculatePhysicalDamageMax,
  calculateElementalDamageMin,
  calculateElementalDamageMax,
} from './damageCalculators';

const framesPerSecond = 25;
const yardsPerGameUnit = 2 / 3;

const formattersByDescline = {
  2: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta} ${calcA}${tb}`), precision: 1}),

  5: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`${ta} ${calcA}`), precison: 1}),
  6: createCalcFormatter({template: (ta, tb, calcA, calcB) => (`+${calcA} ${ta}`)}),

  8: formatAttackRating,
  9: formatPhysicalDamage,
  10: formatElementalDamage,

  66: createFillTaWithCalcAFormatter('%d%'),
};

function formatAttackRating(skill, lvl, skillLevels, ta, tb, ca, cb) {
  const attackRating = calculateToHit(skill, lvl, skillLevels);
  if (attackRating === undefined) {
    return '';
  }
  return `Attack +${attackRating} percent`;
}

function formatPhysicalDamage (skill, lvl, skillLevels, ta, tb, ca, cb) {
  if (skill.minDam === undefined) {
    return '';
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
    return '';
  }
  const minDamage = floor(calculateElementalDamageMin(skill, lvl, skillLevels));
  const maxDamage = floor(calculateElementalDamageMax(skill, lvl, skillLevels));

  if (minDamage === maxDamage) {
    return `${skill.eType} Damage: +${minDamage}`
  }
  return `${skill.eType} Damage: ${minDamage}-${maxDamage}`
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

    return template(ta, tb, calcA, calcB);
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
