from pathlib import Path

import numpy as np
import pandas as pd

from common import safe_int


def get_monster_details(monstats_file: Path) -> dict:
    mon_stats = pd.read_csv(monstats_file, delimiter='\t')
    monster_details = {}
    for index, row in mon_stats.iterrows():
        row = row.copy().replace({np.nan: None})
        row_details = _get_monster_details_for_row(row)
        monster_details[row.Id] = {k: v for k, v in row_details.items() if v or v == 0}
    return monster_details


def _get_monster_details_for_row(row: pd.Series) -> dict:
    return {
        'minHPNormal': safe_int(row['minHP']),
        'maxHPNormal': safe_int(row['maxHP']),
        'minHPNightmare': safe_int(row['MinHP(N)']),
        'maxHPNightmare': safe_int(row['MaxHP(N)']),
        'minHPHell': safe_int(row['MinHP(H)']),
        'maxHPHell': safe_int(row['MaxHP(H)']),
        'a1MinDNormal': safe_int(row['A1MinD']),
        'a1MaxDNormal': safe_int(row['A1MaxD']),
        'a1MinDNightmare': safe_int(row['A1MinD(N)']),
        'a1MaxDNightmare': safe_int(row['A1MaxD(N)']),
        'a1MinDHell': safe_int(row['A1MinD(H)']),
        'a1MaxDHell': safe_int(row['A1MaxD(H)']),
    }


def get_monster_level(monlvl_file: Path) -> dict:
    mon_lvl = pd.read_csv(monlvl_file, delimiter='\t')
    mon_lvl_column_map = {
        'DM': 'DMNormal',
        'DM(N)': 'DMNightmare',
        'DM(H)': 'DMHell',
    }
    return (
        mon_lvl
        .rename(columns=mon_lvl_column_map)
        .set_index('Level')
        .loc[:, mon_lvl_column_map.values()]
        .to_dict()
    )
