const calcLookup = {
  ln12: createLinearCalculator('par1', 'par2'),
  ln34: createLinearCalculator('par3', 'par4'),
  ln56: createLinearCalculator('par5', 'par6'),
  ln78: createLinearCalculator('par7', 'par8'),
  par1: createParamCalculator(1),
  par2: createParamCalculator(2),
  par3: createParamCalculator(3),
  par4: createParamCalculator(4),
  par5: createParamCalculator(5),
  par6: createParamCalculator(6),
  par7: createParamCalculator(7),
  par8: createParamCalculator(8),
};

function createLinearCalculator (paramKeyA, paramKeyB) {
  function calculator (skill, lvl, skillLevels) {
    const a = skill.params[paramKeyA] || 0;
    const b = skill.params[paramKeyB] || 0;
    return a + b * (lvl - 1);
  }
  return calculator;
}

function createParamCalculator (paramNumber) {
  function calculator (skill, lvl, skillLevels) {
    return skill.params[`par${paramNumber}`];
  }
  return calculator;
}

export {createLinearCalculator, createParamCalculator};
export default calcLookup;
