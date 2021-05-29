import calcLookup from './calculators';

function calculateSkillValue (calcExpression, skill, lvl, skillLevels) {
  if (calcExpression === undefined) {
    return undefined
  }
  calcExpression = evaluateCalcs(calcExpression, skill, lvl, skillLevels);
  return calcExpression;
}


function evaluateCalcs (calcExpression, skill, lvl, skillLevels) {
  const re = new RegExp(Object.keys(calcLookup).join('|'));
  const replacer = createCalcReplacer(skill, lvl, skillLevels);
  calcExpression = calcExpression.replace(re, replacer);
  return calcExpression;
}


function createCalcReplacer(skill, lvl, skillLevels) {
  function replacer (match) {
    const calculator = calcLookup[match];
    return calculator(skill, lvl, skillLevels);
  }
  return replacer;
}


export default calculateSkillValue;
