import formattersByDescline from './formatters';

function formatDesclines (root, skill, lvl, skillLevels) {
  if (skill[`${root}Lines`] === undefined) {
    return [];
  }
  let lines = [];
  for (const [lineNumber, entry] of skill[`${root}Lines`].entries()) {
    const line = formatDescline(
      lineNumber,
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
  return lines;
}

function formatDescline (key, desclineNumber, skill, lvl, skillLevels, ta, tb, ca, cb) {
  const formatter = formattersByDescline[desclineNumber];
  if (formatter === undefined) {
    return `MISSING FORMATTER: ${desclineNumber}`;
  }

  const line = formatter(skill, lvl, skillLevels, ta, tb, ca, cb);
  if (line === null) {
    return null;
  }
  if (desclineNumber === 40) {
    return null;
  }
  return line;
}


export default formatDesclines;
