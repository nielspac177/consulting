#!/usr/bin/env python3
"""Parity check: every data-i key in a page has a translation in i18n.js and vice versa."""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = {
    "index": "index.html",
    "mentoring": "mentoring.html",
    "consulting": "consulting.html",
    "telesalud": "telesalud.html",
}
META = ("__title", "__desc")


def page_keys(html):
    return set(re.findall(r'data-i="([^"]+)"', html))


def dict_keys(js, page):
    m = re.search(r"T\.%s\s*=\s*\{(.*?)\n\};" % re.escape(page), js, re.S)
    if not m:
        return None
    return set(re.findall(r'^\s*"([^"]+)"\s*:', m.group(1), re.M))


def check(root=ROOT):
    js_path = root / "i18n.js"
    js = js_path.read_text(encoding="utf-8") if js_path.exists() else ""
    problems = []
    for page, fname in PAGES.items():
        f = root / fname
        if not f.exists():
            continue
        pk = page_keys(f.read_text(encoding="utf-8"))
        dk = dict_keys(js, page)
        if dk is None:
            problems.append(f"{fname}: no T.{page} dictionary in i18n.js")
            continue
        plain = {k for k in dk if not k.startswith("__")}
        for k in sorted(pk - plain):
            problems.append(f"{fname}: key '{k}' missing in T.{page}")
        for k in sorted(plain - pk):
            problems.append(f"{fname}: dictionary key '{k}' has no element")
        for k in META:
            if k not in dk:
                problems.append(f"{fname}: T.{page} lacks {k}")
    return problems


if __name__ == "__main__":
    probs = check()
    for p in probs:
        print(p)
    print("i18n OK" if not probs else f"{len(probs)} problem(s)")
    sys.exit(1 if probs else 0)
