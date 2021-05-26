import re
from typing import Any, Optional


def safe_int(x: Any):
    try:
        return int(x)
    except (TypeError, ValueError):
        return x


def camelcase_skill_or_missile_calc(s: str) -> str:
    if not isinstance(s, str):
        return s

    return re.sub(
        pattern=r"((?:skill|sklvl|miss)\(')((?:\w|\s)+)('(?:\.\w+)+\))",
        repl=lambda match: match[1] + to_camelcase(match[2]) + match[3],
        string=s,
    )


def to_camelcase(s: Optional[str]):
    if not s:
        return ''
    if ' ' in s:
        s = s.title()
    return (s[:1].lower() + s[1:]).replace(' ', '')
