function getBuildString (plannerState, skillDetails) {
  let compressedSkills = {};
  for (const [key, value] of Object.entries(plannerState[`${plannerState.character}Skills`])) {
    const skillName = key.split('Level')[0];
    const skill = skillDetails[skillName];
    compressedSkills[skill.skillId] = value;
  }
  const buildData = {
    v: 1,  // build version
    g: '1.14D', // patch/mod version
    c: plannerState.character,  // character
    s: compressedSkills,  // skills
    t: plannerState.currentTab,
  };
  return btoa(JSON.stringify(buildData));
}

function decompressSkills (compressedSkills, skillsMap) {
  let skills = {};
  for (const [compressedKey, value] of Object.entries(compressedSkills)) {
    skills[skillsMap[compressedKey]] = value;
  }
  return skills;
}

function buildSkillsMap (characterTree) {
  let skillMap = {};
  for (const tree of Object.values(characterTree)) {
    for (const skill of tree.skills) {
      skillMap[skill.id] = `${skill.skillName}Level`;
    }
  }
  return skillMap;
}

export { decompressSkills, buildSkillsMap }
export default getBuildString;
