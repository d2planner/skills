import argparse
import json
from pathlib import Path

from missiles import get_missile_details
from monsters import get_monster_details
from skills import get_raw_character_skills, get_skill_details
from string_mappings import get_elemental_type_map, get_strings_map

module_dir = Path(__file__).parent

# Config
RELATED_NON_CHARSKILLS = ['mon death sentry']
STRING_FILE = module_dir / 'data/string.csv'
EXPANSION_STRING_FILE = module_dir / 'data/expansionstring.csv'
PATCH_STRING_FILE = module_dir / 'data/patchstring.csv'
ELEM_TYPES_FILE = module_dir / 'data/ElemTypes.txt'
MON_STATS_FILE = module_dir / 'data/monstats.txt'
MON_LVL_FILE = module_dir / 'data/MonLvl.txt'
MISSILES_FILE = module_dir / 'data/Missiles.txt'
SKILLS_FILE = module_dir / 'data/skills.txt'
SKILL_DESC_FILE = module_dir / 'data/skilldesc.txt'


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--outfile',
        type=Path,
        default=Path(__file__).absolute().parent / 'data' / 'd2_skill_data.json',
        help='Path to the data directory',
    )
    p = parser.parse_args()
    parse_mpq_data(p.outfile)


def parse_mpq_data(outfile):
    charskills = get_raw_character_skills(
        skills_file=SKILLS_FILE,
        skilldesc_file=SKILL_DESC_FILE,
        strings_map=get_strings_map(STRING_FILE, EXPANSION_STRING_FILE, PATCH_STRING_FILE),
        elemental_type_map=get_elemental_type_map(ELEM_TYPES_FILE),
        related_non_charskills=RELATED_NON_CHARSKILLS,
    )
    skill_details = get_skill_details(
        charskills=charskills,
        missile_details=get_missile_details(MISSILES_FILE),
        monster_details=get_monster_details(MON_STATS_FILE),
    )
    with open(outfile, 'w') as f:
        json.dump(skill_details, f)


if __name__ == '__main__':
    main()
