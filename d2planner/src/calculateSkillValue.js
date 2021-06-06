import { evaluate } from 'mathjs'

import calcLookup from './calculators';

function calculateSkillValue (calcExpression, skill, lvl, skillLevels, skillBonuses) {
  if (calcExpression === undefined) {
    return calcExpression;
  }
  calcExpression = String(calcExpression)
  if (!calcExpression.trim()) {
    return calcExpression;
  }
  calcExpression = fillOtherSkillLevels(calcExpression, skill, skillLevels, skillBonuses);
  calcExpression = evaluateSklvlCalcs(calcExpression, skill, lvl, skillLevels, skillBonuses);
  calcExpression = evaluateOtherEntityCalcs(calcExpression, skill, lvl, skillLevels, skillBonuses);
  calcExpression = evaluateCalcs(calcExpression, skill, lvl, skillLevels, skillBonuses);
  return evaluate(calcExpression);
}

function fillOtherSkillLevels (calcExpression, skill, skillLevels, skillBonuses) {
  const re = /skill\('((?:\w|\s)+)'.(lvl|blvl)\)/g;
  const replacer = (match, group1, group2) => {
    const otherSkillName = group1;
    const lvlKind = group2; 
    if (lvlKind === 'blvl') {
      return skillLevels[otherSkillName] || 0;
    }
    const otherSkill = skill.relatedSkills[otherSkillName]
    return getTotalLevel(otherSkill, skillLevels, skillBonuses);
  };
  return calcExpression.replace(re, replacer);
}

function evaluateSklvlCalcs (calcExpression, skill, lvl, skillLevels, skillBonuses) {
  const re = /sklvl\('((?:\w|\s)+)'\.(\w+)\.(?!lvl)(\w+)\)/g;
  const replacer = (match, group1, group2, group3) => {
    const otherSkill = skill.relatedSkills[group1];
    const lvlCalculator = calcLookup[group2];
    const calculator = calcLookup[group3];

    const effectiveLvl = lvlCalculator(skill, lvl, skillLevels, skillBonuses);
    return calculator(otherSkill, effectiveLvl, skillLevels, skillBonuses);
  }
  return calcExpression.replace(re, replacer);
}

function evaluateOtherEntityCalcs (calcExpression, skill, lvl, skillLevels, skillBonuses) {
  const re = /(skill|miss)\('((?:\w|\s)+)'\.(?!lvl)(\w+)\)/g;
  const replacer = (match, group1, group2, group3) => {
    const entityKind = getEntityKind(group1);
    const entityName = group2;
    const entity = skill[`related${entityKind}s`][entityName];

    const calculator = calcLookup[group3];
    lvl = (entityKind === 'Skill') ? skillLevels[entityName] || 0 : lvl;
    return calculator(entity, lvl, skillLevels, skillBonuses);
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

function evaluateCalcs (calcExpression, skill, lvl, skillLevels, skillBonuses) {
  const re = new RegExp(Object.keys(calcLookup).join('|'), 'g');
  const replacer = (match) => {
    const calculator = calcLookup[match];
    return calculator(skill, lvl, skillLevels, skillBonuses);
  }
  return calcExpression.replace(re, replacer);
}

function getTotalLevel (skill, skillLevels, skillBonuses) {
  const generalBonus = (skillBonuses.all || 0) + (skillBonuses[`tab${skill.skillPage}`] || 0);
  const lvl = skillLevels[skill.skillName] || 0;
  const totalBonus = getTotalBonus(lvl, skillBonuses[skill.skillName] || 0, generalBonus);
  return lvl + totalBonus;
}

function getTotalBonus (lvl, skillBonus, generalBonus) {
  if (!((lvl + skillBonus) > 0)) {  // only apply bonus with hard point or specific bonus
    return 0;
  }
  return skillBonus + generalBonus;
}

export {getTotalBonus, getTotalLevel};
export default calculateSkillValue;
