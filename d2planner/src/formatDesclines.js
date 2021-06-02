import formattersByDescline from './formatters';

function formatDesclines (root, skill, lvl, skillLevels) {
  if (skill[`${root}Lines`] === undefined) {
    return null;
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
  if (lines.length === 0) {
    return null;
  }
  if (root === 'dsc3') {
    return (
      <div className='synergyBlock'>
        <h3 className='synergyHeader'>Synergy Bonuses:</h3>
        <ul className={root}>{lines}</ul>
      </div>
    );
  }
  return <ul className={root}>{lines}</ul>;
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
  return <li className={`descline${desclineNumber}`} key={key}>{line}</li>;
}


export default formatDesclines;
