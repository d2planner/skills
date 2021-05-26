from pathlib import Path

import numpy as np
import pandas as pd

from common import safe_int, camelcase_skill_or_missile_calc, to_camelcase

N_SUBMISSILES_BY_ROOT = {
    'SubMissile': 3,
    'HitSubMissile': 4,
    'CltSubMissile': 3,
    'CltHitSubMissile': 4,
}


def get_missile_details(missiles_file: Path) -> dict:
    missiles = pd.read_csv(missiles_file, delimiter='\t')
    missile_details = {}
    for index, row in missiles.iterrows():
        row = row.copy().replace({np.nan: None})
        row_details = _get_missile_details_for_row(row)
        missile_details[row.Missile] = {k: v for k, v in row_details.items() if v or v == 0}

    for index, row in missiles.iterrows():  # requires all missiles populated first
        row = row.copy().replace({np.nan: None})
        for root, n_submissiles in N_SUBMISSILES_BY_ROOT.items():
            for submissile_num in range(1, n_submissiles + 1):
                submissile_key = row[f'{root}{submissile_num}']
                if submissile_key:
                    missile_details[row.Missile][f'{to_camelcase(root)}{submissile_num}'] = (
                        missile_details[submissile_key]
                    )
    return missile_details


def _get_missile_details_for_row(row: pd.Series) -> dict:
    return {
        'range': safe_int(row.Range),
        'levRange': safe_int(row.LevRange),
        'hitShift': safe_int(row.HitShift),
        'minDamage': safe_int(row.MinDamage),
        'minLevDam1': safe_int(row.MinLevDam1),
        'minLevDam2': safe_int(row.MinLevDam2),
        'minLevDam3': safe_int(row.MinLevDam3),
        'minLevDam4': safe_int(row.MinLevDam4),
        'minLevDam5': safe_int(row.MinLevDam5),
        'maxDamage': safe_int(row.MaxDamage),
        'maxLevDam1': safe_int(row.MaxLevDam1),
        'maxLevDam2': safe_int(row.MaxLevDam2),
        'maxLevDam3': safe_int(row.MaxLevDam3),
        'maxLevDam4': safe_int(row.MaxLevDam4),
        'maxLevDam5': safe_int(row.MaxLevDam5),
        'dmgSymPerCalc': camelcase_skill_or_missile_calc(row.DmgSymPerCalc),
        'eType': row.EType,
        'eMin': safe_int(row.EMin),
        'eMinLev1': safe_int(row.MinELev1),
        'eMinLev2': safe_int(row.MinELev2),
        'eMinLev3': safe_int(row.MinELev3),
        'eMinLev4': safe_int(row.MinELev4),
        'eMinLev5': safe_int(row.MinELev5),
        'eMax': safe_int(row.Emax),
        'eMaxLev1': safe_int(row.MaxELev1),
        'eMaxLev2': safe_int(row.MaxELev2),
        'eMaxLev3': safe_int(row.MaxELev3),
        'eMaxLev4': safe_int(row.MaxELev4),
        'eMaxLev5': safe_int(row.MaxELev5),
        'eDmgSymPerCalc': camelcase_skill_or_missile_calc(row.EDmgSymPerCalc),
        'eLen': safe_int(row.ELen),
        'eLevLen1': safe_int(row.ELevLen1),
        'eLevLen2': safe_int(row.ELevLen2),
        'eLevLen3': safe_int(row.ELevLen3),
    }
