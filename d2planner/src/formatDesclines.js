import formattersByDescline from './formatters';

function formatDesclines (root, skill, lvl, skillLevels) {
  if (skill[`${root}Lines`] === undefined) {
    return null;
  }
  let lines = [];
  for (const entry of skill[`${root}Lines`]) {
    const line = formatDescline(
      entry[`${root}Line`],
      skill,
      lvl,
      skillLevels,
      entry[`${root}TextA`],
      entry[`${root}TextB`],
      entry[`${root}CalcA`],
      entry[`${root}CalcB`],
    );
    if (line !== null) {
      lines.push(line);
    }
  }
  if (lines.length === 0) {
    return null;
  }
  return lines.filter(line => line !== null).join('\n');
}

function formatDescline (desclineNumber, skill, lvl, skillLevels, ta, tb, ca, cb) {
  const formatter = formattersByDescline[desclineNumber];
  if (formatter === undefined) {
    return `MISSING FORMATTER: ${desclineNumber}`;
  }
  return formatter(skill, lvl, skillLevels, ta, tb, ca, cb);
}


export default formatDesclines;
