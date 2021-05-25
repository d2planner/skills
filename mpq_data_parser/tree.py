from collections import defaultdict


def build_skills_tree_lookup(skill_details: dict) -> dict[str, dict[int, list[dict]]]:
    tree = defaultdict(lambda: defaultdict(list))
    for skill_name, skill in skill_details.items():
        skill_metadata = {
            'skillName': skill_name,
            'row': skill['skillRow'],
            'column': skill['skillColumn'],
        }
        tree[skill['charclass']][skill['skillPage']].append(skill_metadata)
    return tree
