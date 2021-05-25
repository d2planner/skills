import pandas as pd


def get_strings_map(string_file, expansionstring_file, patchstring_file):

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


def _clean_string(s):
    try:
        cleaned = s.replace('\\n', '\n')
        if s[:2].isnumeric():
            return cleaned
        return '\n'.join(reversed(cleaned.split('\n')))  # reverse skill strings
    except AttributeError:
        return s


def get_elemental_type_map(elemtypes_file):
    elem_types = pd.read_csv(elemtypes_file, delimiter='\t')
    return elem_types.dropna().set_index('Code')['Elemental Type'].to_dict()
