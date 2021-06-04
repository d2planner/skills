import { evaluate } from 'mathjs'

import calcLookup from './calculators';

function calculateSkillValue (calcExpression, skill, lvl, skillLevels) {
  if (calcExpression === undefined) {
    return calcExpression;
  }
  calcExpression = String(calcExpression)
  if (!calcExpression.trim()) {
    return calcExpression;
  }
  calcExpression = fillOtherSkillLevels(calcExpression, skillLevels);
  calcExpression = evaluateSklvlCalcs(calcExpression, skill, lvl, skillLevels);
  calcExpression = evaluateOtherEntityCalcs(calcExpression, skill, lvl, skillLevels);
  calcExpression = evaluateCalcs(calcExpression, skill, lvl, skillLevels);
  return evaluate(calcExpression);
}

function fillOtherSkillLevels (calcExpression, skillLevels) {
  const re = /skill\('((?:\w|\s)+)'.(?:lvl|blvl)\)/g;
  const replacer = (match, group1) => (skillLevels[group1] || 0);
  return calcExpression.replace(re, replacer);
}

function evaluateSklvlCalcs (calcExpression, skill, lvl, skillLevels) {
  const re = /sklvl\('((?:\w|\s)+)'\.(\w+)\.(?!lvl)(\w+)\)/g;
  const replacer = (match, group1, group2, group3) => {
    const otherSkill = skill.relatedSkills[group1];
    const lvlCalculator = calcLookup[group2];
    const calculator = calcLookup[group3];

    const effectiveLvl = lvlCalculator(skill, lvl, skillLevels);
    return calculator(otherSkill, effectiveLvl, {});
  }
  return calcExpression.replace(re, replacer);
}

function evaluateOtherEntityCalcs (calcExpression, skill, lvl, skillLevels) {
  const re = /(skill|miss)\('((?:\w|\s)+)'\.(?!lvl)(\w+)\)/g;
  const replacer = (match, group1, group2, group3) => {
    const entityKind = getEntityKind(group1);
    const entityName = group2;
    const entity = skill[`related${entityKind}s`][entityName];

    const calculator = calcLookup[group3];
    lvl = (entityKind === 'Skill') ? skillLevels[entityName] || 0 : lvl;
    return calculator(entity, lvl, skillLevels);
  }
  return calcExpression.replace(re, replacer);
}

function getEntityKind (entityKey) {
  const entityKindLookup = {'miss': 'Missile', 'skill': 'Skill'};
  if (!(entityKey in entityKindLookup)) {
    throw Error(`logic for handling ${entityKey} entity calcs not implemented.`);
  }
  return entityKindLookup[entityKey];
}

function evaluateCalcs (calcExpression, skill, lvl, skillLevels) {
  const re = new RegExp(Object.keys(calcLookup).join('|'), 'g');
  const replacer = (match) => {
    const calculator = calcLookup[match];
    return calculator(skill, lvl, skillLevels);
  }
  return calcExpression.replace(re, replacer);
}

export default calculateSkillValue;
