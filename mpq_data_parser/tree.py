TREE_NAMES_LOOKUP = {
    'amazon1': ('StrSklTree10', 'StrSklTree11'),
    'amazon2': ('StrSklTree8', 'StrSklTree9'),
    'amazon3': ('StrSklTree6', 'StrSklTree7'),
    'paladin1': ('StrSklTree15', 'StrSklTree4'),
    'paladin2': ('StrSklTree14', 'StrSklTree13'),
    'paladin3': ('StrSklTree12', 'StrSklTree13'),
    'necromancer1': ('StrSklTree19',),
    'necromancer2': ('StrSklTree17', 'StrSklTree18', 'StrSklTree5'),
    'necromancer3': ('StrSklTree16', 'StrSklTree5'),
    'barbarian1': ('StrSklTree21', 'StrSklTree4'),
    'barbarian2': ('StrSklTree21', 'StrSklTree22'),
    'barbarian3': ('StrSklTree20',),
    'sorceress3': ('StrSklTree23', 'StrSklTree5'),
    'sorceress2': ('StrSklTree24', 'StrSklTree5'),
    'sorceress1': ('StrSklTree25', 'StrSklTree5'),
    'druid1': ('StrSklTree26',),
    'druid2': ('StrSklTree27', 'StrSklTree28'),
    'druid3': ('StrSklTree29',),
    'assassin1': ('StrSklTree30',),
    'assassin2': ('StrSklTree31', 'StrSklTree32'),
    'assassin3': ('StrSklTree33', 'StrSklTree34'),
}
LAST_ROW_NUMBER = 6


def build_skills_tree_lookup(
    skill_details: dict,
    strings_map: dict[str, str]
) -> dict[str, dict[int, dict]]:
    reset_button_columns_by_page = _get_reset_button_columns_by_page(skill_details)

    characters = {skill['charclass'] for skill in skill_details.values()}
    tree = {
        character: {
            page: {
                'treeName': _get_tree_name(character, page, strings_map),
                'resetButtonColumn': reset_button_columns_by_page[character][page],
                'skills': [],
            } for page in range(1, 4)
        } for character in characters
    }
    for skill_name, skill in skill_details.items():
        skill_metadata = {
            'skillName': skill_name,
            'row': skill['skillRow'],
            'column': skill['skillColumn'],
            'id': skill['skillId'],
        }
        if skill.get('requirements'):
            skill_metadata['requirements'] = skill['requirements']
        tree[skill['charclass']][skill['skillPage']]['skills'].append(skill_metadata)
    return tree


def _get_tree_name(character: str, tree: int, strings_map: dict) -> str:
    string_keys = TREE_NAMES_LOOKUP[f'{character}{tree}']
    return '\n'.join(strings_map[key] for key in string_keys)


def _get_reset_button_columns_by_page(skill_details):
    characters = {skill['charclass'] for skill in skill_details.values()}
    open_bottom_rows = {
        character: {
            page: {1, 2, 3} for page in range(1, 4)
        } for character in characters 
    }
    for skill_name, skill in skill_details.items():
        if skill['skillRow'] == LAST_ROW_NUMBER:
            open_bottom_rows[skill['charclass']][skill['skillPage']].remove(skill['skillColumn'])
    return {
        character: {
            page: _get_reset_button_column(open_bottom_rows[character][page]) for page in range(1, 4)
        } for character in characters
    }


def _get_reset_button_column(open_bottom_rows: set):
    order_of_preference = [1, 3, 2]
    for column in order_of_preference:
        if column in open_bottom_rows:
            return column
    raise ValueError(f'No reset button column found for {open_bottom_rows}')
