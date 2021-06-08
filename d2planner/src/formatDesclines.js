import formattersByDescline from './formatters';

function formatDesclines (root, skill, lvl, skillLevels, skillBonuses, difficulty) {
  if (skill[`${root}Lines`] === undefined) {
    return [];
  }
  let lines = [];
  for (const entry of skill[`${root}Lines`]) {
    const line = formatDescline(
      entry[`${root}Line`],
      skill,
      lvl,
      skillLevels,
      skillBonuses,
      difficulty,
      entry[`${root}TextA`],
      entry[`${root}TextB`],
      entry[`${root}CalcA`],
      entry[`${root}CalcB`],
    );
    if (line !== null) {
      lines.push(line);
    }
  }
  return lines;
}

function formatDescline (desclineNumber, skill, lvl, skillLevels, skillBonuses, difficulty, ta, tb, ca, cb) {
  const formatter = formattersByDescline[desclineNumber];
  if (formatter === undefined) {
    return `MISSING FORMATTER: ${desclineNumber}`;
  }

  const line = formatter(skill, lvl, skillLevels, skillBonuses, difficulty, ta, tb, ca, cb);
  if (line === null) {
    return null;
  }
  if (desclineNumber === 40) {  // remove synergy line, rendered separately
    return null;
  }
  return line;
}


export default formatDesclines;
