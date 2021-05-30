import calculateSkillValue from './calculateSkillValue'

const framesPerSecond = 25;
const yardsPerGameUnit = 2 / 3;

const formattersByDescline = {
  6: createCalcFormatter((ta, tb, ca, cb) => (`+${ca} ${ta}`)),
};


function createCalcFormatter (template, frames=false, gameUnits=false, precision=null, multiplier=null) {
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
