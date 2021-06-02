from pathlib import Path
import re

import pandas as pd


def get_strings_map(string_file: Path, expansionstring_file: Path, patchstring_file: Path) -> dict[str, str]:

    strings = pd.read_csv(string_file, header=0, names=('key', 'value'))
    expansionstring = pd.read_csv(expansionstring_file, header=0, names=('key', 'value'))
    patchstring = pd.read_csv(patchstring_file, header=0, names=('key', 'value'))

    all_strings = (
        pd.concat([
            strings.assign(source='strings').drop_duplicates(subset=['key'], keep='first'),
            expansionstring.assign(source='expansionstring').drop_duplicates(subset=['key'], keep='first'),
            patchstring.assign(source='patchstring').drop_duplicates(subset=['key'], keep='first'),
        ])
        .drop_duplicates(subset=['key'], keep='last')
    )

    return (
        all_strings.set_index('key').value
        .apply(_clean_string)
        .to_dict()
    )


def _clean_string(s: str) -> str:
    try:
        cleaned = s.replace('\\n', '\n')
        if re.match(r'\d+\n', cleaned):  # strings tarting with numbers on a separate line not reversed
            return cleaned
        return '\n'.join(reversed(cleaned.split('\n')))  # reverse skill strings
    except AttributeError:
        return s


def get_elemental_type_map(elemtypes_file: Path) -> dict[str, str]:
    elem_types = pd.read_csv(elemtypes_file, delimiter='\t')
    return elem_types.dropna().set_index('Code')['Elemental Type'].to_dict()
