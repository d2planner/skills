from pathlib import Path
import re
from typing import Optional, Union

import numpy as np
import pandas as pd

from common import safe_int, camelcase_skill_or_missile_calc, to_camelcase

# Constants
N_PASSIVE_STATS = 5
N_CALC_COLS = 4
N_PARAMS = 8
N_DESC_COLS = 6
N_DSC2_COLS = 4
N_DSC3_COLS = 7
N_REQSKILL_COLS = 3
LVL_BREAKPOINTS = [(0, 1), (1, 8), (8, 16), (16, 22), (22, 28), (28, None)]
CHARCLASS_MAP = {
    'ama': 'amazon',
    'ass': 'assassin',
    'bar': 'barbarian',
    'dru': 'druid',
    'nec': 'necromancer',
    'pal': 'paladin',
    'sor': 'sorceress',
}
COMPRESSED_ID_MAP = {
    raw_id: compressed_id
    for raw_id, compressed_id in enumerate('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
}


def get_skill_details(
    charskills: Path,
    missile_details: Path,
    monster_details: Path,
    related_non_charskills: Optional[list[str]] = None,
) -> dict:
    skill_details = {}
    charskills = (
        charskills.copy()
        .sort_values(['charclass', 'SkillPage', 'SkillRow', 'SkillColumn'])  # deterministic id order
    )

    raw_id = 0
    previous_character = None
    for index, row in charskills.iterrows():
        row = row.copy().replace({np.nan: None})
        skill_key = to_camelcase(row.skill)

        row_details = _get_skill_details_for_row(row, missile_details, monster_details)
        row_details['skillId'] = COMPRESSED_ID_MAP[raw_id]
        if previous_character == row.charclass:
            raw_id += 1
        else:
            raw_id = 0
            previous_character = row.charclass
        skill_details[skill_key] = {k: v for k, v in row_details.items() if v or v == 0}

    for index, row in charskills.iterrows():  # requires all skills populated first
        row = row.copy().replace({np.nan: None})
        skill_key = to_camelcase(row.skill)

        skill_details[skill_key]['requirements'] = _get_recursive_requirements(skill_key, skill_details)
        skill_details[skill_key]['synergies'] = _get_synergies_for_row(skill_key, skill_details)

        other_skill_params_pattern = r"(?:skill|sklvl)\('((?:\w|\s)+)'(?:\.(?!lvl|blvl)\w+)+\)"
        related_skills = _get_related_entities_for_calcs(row, other_skill_params_pattern)
        if (row.charclass == 'sor') and (row.EType in ('Fire', 'Lightning')):
            related_skills.add(f'{row.EType.lower()}Mastery')
        skill_details[skill_key]['relatedSkills'] = {
            skill: _without_related(skill_details[skill]) for skill in related_skills
        }

        related_missiles = _get_related_entities_for_calcs(row, r"miss\('((?:\w|\s)+)'\.\w+\)")
        skill_details[skill_key]['relatedMissiles'] = {
            missile: _without_related(missile_details[missile]) for missile in related_missiles
        }

        skill_details[skill_key] = {k: v for k, v in skill_details[skill_key].items() if v or v == 0}

    for non_char_skill in related_non_charskills or []:
        del skill_details[to_camelcase(non_char_skill)]

    return skill_details


def _get_recursive_requirements(skill_key: str, skill_details: dict) -> list[str]:
    skill = skill_details[skill_key]
    requirements = []
    for required_skill_name in skill.get('reqSkills', []):
        requirement = {
            'skillName': required_skill_name,
            'edges': _get_requirement_edge(skill, skill_details[required_skill_name])
        }
        requirements.append(requirement)
        nested_requirements = _get_recursive_requirements(required_skill_name, skill_details)
        requirements.extend(nested_requirements)
    return requirements


def _get_requirement_edge(skill_a: dict, skill_b: dict):
    skills = sorted([skill_a, skill_b], key=lambda skill: (skill['skillRow'], skill['skillColumn']))
    return {
        'from': {'row': skills[0]['skillRow'], 'column': skills[0]['skillColumn']},
        'to': {'row': skills[1]['skillRow'], 'column': skills[1]['skillColumn']},
    }


def _get_synergies_for_row(skill_key: str, skill_details: dict) -> list[str]:
    charclass = skill_details[skill_key].get('charclass')
    skill_name_lookup = {
        skill['strName']: skill['skillName']
        for skill in skill_details.values()
        if skill.get('strName') is not None and skill.get('charclass') == charclass
    }
    pattern = r"|".join([strName for strName in skill_name_lookup.keys()])

    synergies = set()
    for line in skill_details[skill_key].get('dsc3Lines', []):
        if line['dsc3Line'] == 40:
            continue
        
        match = re.match(pattern=pattern, string=line['dsc3TextA'])
        if match:
            synergies.add(skill_name_lookup[match[0]])
    return list(synergies)


def _get_related_entities_for_calcs(row: pd.Series, pattern=str) -> set[str]:
    related = set()
    for calc_column in _get_calc_columns():
        calc_expression = row[calc_column]
        if not calc_expression:
            continue

        matches = re.findall(pattern=pattern, string=str(calc_expression))
        related = related.union({to_camelcase(match) for match in matches})
    return related


def _without_related(skill: dict) -> dict:
    skill = skill.copy()
    skill.pop('relatedSkills', None)
    skill.pop('relatedMissiles', None)
    return skill


def _get_skill_details_for_row(row: pd.Series, missile_details: dict, monster_details: dict) -> dict:
    return {
        'skillName': to_camelcase(row.skill),
        'strName': row['str name'],
        'strLong': row['str long'],
        'charclass': CHARCLASS_MAP.get(row.charclass),
        'skillPage': safe_int(row.SkillPage),
        'skillRow': safe_int(row.SkillRow),
        'skillColumn': safe_int(row.SkillColumn),
        'reqLevel': safe_int(row.reqlevel),
        'reqSkills': _get_immediate_required_skills_for_row(row),
        'strMana': row['str mana'],
        'mana': safe_int(row['mana']),
        'lvlMana': safe_int(row['lvlmana']),
        'minMana': safe_int(row['minmana']),
        'manaShift': safe_int(row['manashift']),
        'toHit': safe_int(row.ToHit),
        'levToHit': safe_int(row.LevToHit),
        'toHitCalc': camelcase_skill_or_missile_calc(row.ToHitCalc),
        'hitShift': safe_int(row.HitShift),
        'srcDam': safe_int(row.SrcDam),
        'minDam': safe_int(row.MinDam),
        'minLevDam1': safe_int(row.MinLevDam1),
        'minLevDam2': safe_int(row.MinLevDam2),
        'minLevDam3': safe_int(row.MinLevDam3),
        'minLevDam4': safe_int(row.MinLevDam4),
        'minLevDam5': safe_int(row.MinLevDam5),
        'maxDam': safe_int(row.MaxDam),
        'maxLevDam1': safe_int(row.MaxLevDam1),
        'maxLevDam2': safe_int(row.MaxLevDam2),
        'maxLevDam3': safe_int(row.MaxLevDam3),
        'maxLevDam4': safe_int(row.MaxLevDam4),
        'maxLevDam5': safe_int(row.MaxLevDam5),
        'dmgSymPerCalc': camelcase_skill_or_missile_calc(row.DmgSymPerCalc),
        'eType': row.EType,
        'eMin': safe_int(row.EMin),
        'eMinLev1': safe_int(row.EMinLev1),
        'eMinLev2': safe_int(row.EMinLev2),
        'eMinLev3': safe_int(row.EMinLev3),
        'eMinLev4': safe_int(row.EMinLev4),
        'eMinLev5': safe_int(row.EMinLev5),
        'eMax': safe_int(row.EMax),
        'eMaxLev1': safe_int(row.EMaxLev1),
        'eMaxLev2': safe_int(row.EMaxLev2),
        'eMaxLev3': safe_int(row.EMaxLev3),
        'eMaxLev4': safe_int(row.EMaxLev4),
        'eMaxLev5': safe_int(row.EMaxLev5),
        'eDmgSymPerCalc': camelcase_skill_or_missile_calc(row.EDmgSymPerCalc),
        'eLen': safe_int(row.ELen),
        'eLevLen1': safe_int(row.ELevLen1),
        'eLevLen2': safe_int(row.ELevLen2),
        'eLevLen3': safe_int(row.ELevLen3),
        'eLenSymPerCalc': camelcase_skill_or_missile_calc(row.ELenSymPerCalc),
        'mastery': _get_mastery_details_for_row(row),
        'calcs': _get_calc_fields_for_row(row),
        'params': {
            f'par{i}': safe_int(row[f'Param{i}'])
            for i in range(1, N_PARAMS + 1)
            if row.get(f'Param{i}') is not None
        },
        'descLines': _get_desclines_for_row(row, 'desc', N_DESC_COLS),
        'dsc2Lines': _get_desclines_for_row(row, 'dsc2', N_DSC2_COLS),
        'dsc3Lines': _get_desclines_for_row(row, 'dsc3', N_DSC3_COLS),
        'missile1': missile_details.get(row.descmissile1),
        'missile2': missile_details.get(row.descmissile2),
        'missile3': missile_details.get(row.descmissile3),
        'summon': monster_details.get(row.summon.lower() if row.summon else None),
    }


def _get_immediate_required_skills_for_row(row: pd.Series) -> list[str]:
    return [to_camelcase(row[f'reqskill{i}']) for i in range(1, N_REQSKILL_COLS + 1) if row[f'reqskill{i}']]


def _get_calc_columns() -> list[str]:
    calc_columns = [
        'DmgSymPerCalc',
        'EDmgSymPerCalc',
        'ELenSymPerCalc',
        'auralencalc',
        *[f'calc{i}' for i in range(1, N_CALC_COLS + 1)], 
    ]
    for col_root, line_limit in {
        'desccalc': N_DESC_COLS, 'dsc2calc': N_DSC2_COLS, 'dsc3calc': N_DSC3_COLS
    }.items():
        for a_b in 'ab':
            for i in range(1, line_limit + 1):
                calc_columns.append(f'{col_root}{a_b}{i}')
    return calc_columns


def _get_mastery_details_for_row(row: pd.Series) -> dict[str, str]:
    passives = {row[f'passivestat{i}']: row[f'passivecalc{i}'] for i in range(1, N_PASSIVE_STATS + 1)}
    mastery_details = {
        'passiveMasteryTh': passives.get('passive_mastery_melee_th') or passives.get('passive_mastery_throw_th'),
        'passiveMasteryDmg': passives.get('passive_mastery_melee_dmg') or passives.get('passive_mastery_throw_dmg'),
        'passiveMasteryCrit': passives.get('passive_mastery_melee_crit') or passives.get('passive_mastery_throw_crit'),
    }
    return {k: camelcase_skill_or_missile_calc(v) for k, v in mastery_details.items() if v or v == 0}


def _get_calc_fields_for_row(row: pd.Series) -> dict[str, Union[int, str]]:
    calcs = {
        'auraLen': row.auralencalc,
        **{f'calc{i}': row[f'calc{i}'] for i in range(1, N_CALC_COLS + 1)},
    }
    return {k: camelcase_skill_or_missile_calc(v) for k, v in calcs.items() if v or v == 0}


def _get_desclines_for_row(row: pd.Series, column_root: str, max_entries: int) -> list[dict]:
    row = row.copy().replace({np.nan: None})

    entries = []
    for i in range(1, max_entries + 1):
        if not row[f'{column_root}line{i}']:
            continue

        entry = {
            f'{column_root}Line': int(row[f'{column_root}line{i}']),
            f'{column_root}TextA': row[f'{column_root}texta{i}'],
            f'{column_root}TextB': row[f'{column_root}textb{i}'],
            f'{column_root}CalcA': safe_int(row[f'{column_root}calca{i}']),
            f'{column_root}CalcB': safe_int(row[f'{column_root}calcb{i}']),
        }
        entries.append({k: camelcase_skill_or_missile_calc(v) for k, v in entry.items() if v or v == 0})

    if column_root in ('desc', 'dsc2'):
        entries.reverse()  # D2 renders desclines bottom-up
    return entries


def get_character_skills(
    skills_file: Path,
    skilldesc_file: Path,
    strings_map: dict[str, str],
    elemental_type_map: dict[str, str],
    related_non_charskills: Optional[list[str]] = None
) -> pd.DataFrame:
    skills = pd.read_csv(skills_file, delimiter='\t')
    skilldesc = pd.read_csv(skilldesc_file, delimiter='\t')

    charskills = (
        skills
        .loc[skills.charclass.notnull() | (skills.skill.isin(related_non_charskills or []))]
        .merge(skilldesc, how='left', on='skilldesc', validate='one_to_one')
    )
    # Replace string keys with values from .tbl files
    string_mapped_columns = _get_string_mapped_columns()
    charskills.loc[:, string_mapped_columns] = charskills[string_mapped_columns].replace(strings_map)
    # Replace elemental types with mapped values
    charskills.loc[:, 'EType'] = charskills.EType.replace(elemental_type_map)
    return charskills


def _get_string_mapped_columns() -> list[str]:
    string_mapped_columns = ['str name', 'str long', 'str alt', 'str mana']
    for col_root, line_limit in {'desctext': N_DESC_COLS, 'dsc2text': N_DSC2_COLS, 'dsc3text': N_DSC3_COLS}.items():
        for a_b in 'ab':
            for i in range(1, line_limit + 1):
                string_mapped_columns.append(f'{col_root}{a_b}{i}')
    return string_mapped_columns
