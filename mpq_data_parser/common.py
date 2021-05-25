from typing import Any, Optional


def safe_int(x: Any):
    try:
        return int(x)
    except (TypeError, ValueError):
        return x


def to_camelcase(s: Optional[str]):
    if not s:
        return ''
    if ' ' in s:
        s = s.title()
    return (s[:1].lower() + s[1:]).replace(' ', '')
