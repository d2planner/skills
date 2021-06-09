function stateToBuildString (plannerState, skillDetails) {
  const compressedSkills = compressSkillNames(plannerState[`${plannerState.character}SkillLevels`], skillDetails);
  const compressedBonuses = compressSkillNames(plannerState[`${plannerState.character}SkillBonuses`], skillDetails);
  const buildData = {
    v: 1,  // build version
    p: '1.14D', // patch/mod version
    c: plannerState.character,  // character
    s: compressedSkills,  // skills
    b: compressedBonuses,  // bonuses
    t: plannerState.currentTab,
  };
  return btoa(JSON.stringify(buildData));
}

function buildStringToState (buildString, treeData) {
  const build = (buildString) ? JSON.parse(atob(buildString)) : {};
  if (!build.c) {
    return null;
  }

  const skillsMap = buildSkillsMap(treeData[build.c]);
  return {
    character: build.c,
    currentSkill: treeData[build.c][1].skills[0].skillName,
    currentTab: build.t || 1,
    [`${build.c}SkillLevels`]: (build.s !== undefined) ? decompressSkills(build.s, skillsMap) : {},
    [`${build.c}SkillBonuses`]: (build.b !== undefined) ? decompressSkills(build.b, skillsMap) : {},
  };
}

function decompressSkills (compressedSkills, skillsMap) {
  let skills = {};
  for (const [compressedKey, value] of Object.entries(compressedSkills)) {
    const key = skillsMap[compressedKey] || compressedKey;
    skills[key] = value;
  }
  return skills;
}

function buildSkillsMap (characterTree) {
  let skillMap = {};
  for (const tree of Object.values(characterTree)) {
    for (const skill of tree.skills) {
      skillMap[skill.id] = skill.skillName;
    }
  }
  return skillMap;
}

function compressSkillNames (skillLookup, skillDetails) {
  let compressedSkills = {};
  for (const [key, value] of Object.entries(skillLookup)) {
    const skillName = key.split('Level')[0];
    const skill = skillDetails[skillName] || {};
    compressedSkills[skill.skillId || key] = value;
  }
  return compressedSkills;
}

export { buildStringToState }
export default stateToBuildString;
