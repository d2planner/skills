import argparse
import json
from pathlib import Path

from missiles import get_missile_details
from monsters import get_monster_details
from skills import get_character_skills, get_skill_details
from string_mappings import get_elemental_type_map, get_strings_map
from tree import build_skills_tree_lookup

MODULE_DIR = Path(__file__).absolute().parent

# Config
RELATED_NON_CHARSKILLS = ['mon death sentry']
STRING_FILE = MODULE_DIR / 'data/string.csv'
EXPANSION_STRING_FILE = MODULE_DIR / 'data/expansionstring.csv'
PATCH_STRING_FILE = MODULE_DIR / 'data/patchstring.csv'
ELEM_TYPES_FILE = MODULE_DIR / 'data/ElemTypes.txt'
MON_STATS_FILE = MODULE_DIR / 'data/monstats.txt'
MON_LVL_FILE = MODULE_DIR / 'data/MonLvl.txt'
MISSILES_FILE = MODULE_DIR / 'data/Missiles.txt'
SKILLS_FILE = MODULE_DIR / 'data/skills.txt'
SKILL_DESC_FILE = MODULE_DIR / 'data/skilldesc.txt'


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--outfile',
        type=Path,
        default=MODULE_DIR / 'data' / 'd2_skill_data.json',
        help='Path to the data directory',
    )
    p = parser.parse_args()
    parse_mpq_data(p.outfile)


def parse_mpq_data(outfile: Path) -> None:
    strings_map = get_strings_map(STRING_FILE, EXPANSION_STRING_FILE, PATCH_STRING_FILE)
    charskills = get_character_skills(
        skills_file=SKILLS_FILE,
        skilldesc_file=SKILL_DESC_FILE,
        strings_map=strings_map,
        elemental_type_map=get_elemental_type_map(ELEM_TYPES_FILE),
        related_non_charskills=RELATED_NON_CHARSKILLS,
    )
    skill_details = get_skill_details(
        charskills=charskills,
        missile_details=get_missile_details(MISSILES_FILE),
        monster_details=get_monster_details(MON_STATS_FILE),
        related_non_charskills=RELATED_NON_CHARSKILLS,
    )
    mpq_data = {
        'tree': build_skills_tree_lookup(skill_details, strings_map),
        'skillDetails': skill_details,
    }

    with open(outfile, 'w') as f:
        json.dump(mpq_data, f)


if __name__ == '__main__':
    main()
