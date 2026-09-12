#!/usr/bin/env python3
"""Site check: internal links resolve, WhatsApp links carry both languages,
every page loads i18n.js deferred in <head>, and amounts match between the
two languages."""
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
EXTERNAL = ("#", "mailto:", "http://", "https://", "data:")
I18N_TAG = '<script src="i18n.js" defer></script>'
AMOUNT = re.compile(r"US\$ ?\d+|S/ ?\d+|993 126 398")


def local_refs(html):
    """(attribute, value) for every href/src that should resolve inside the repo."""
    refs = []
    for attr, value in re.findall(r'\b(href|src)="([^"]*)"', html):
        if not value or value.startswith(EXTERNAL):
            continue
        refs.append((attr, value))
    return refs


def whatsapp_anchors(html):
    """Opening <a> tags pointing at a wa.me link that carries a prefilled message."""
    anchors = []
    for tag in re.findall(r"<a\s[^>]*>", html):
        m = re.search(r'href="([^"]*)"', tag)
        if not m:
            continue
        href = m.group(1)
        if href.startswith("https://wa.me/") and "?text=" in href:
            anchors.append((tag, href))
    return anchors


def element_html(html, key):
    """Inner HTML of the element carrying data-i="key", or None."""
    m = re.search(
        r'<(\w+)[^>]*\sdata-i="%s"[^>]*>(.*?)</\1>' % re.escape(key), html, re.S)
    return m.group(2) if m else None


def dict_entries(js, page):
    """{key: value} for T.<page>, or None when the dictionary is absent."""
    m = re.search(r"T\.%s\s*=\s*\{(.*?)\n\};" % re.escape(page), js, re.S)
    if not m:
        return None
    entries = {}
    for line in m.group(1).split("\n"):
        e = re.match(r'\s*"([^"]+)"\s*:\s*"(.*)"\s*,?\s*$', line)
        if e:
            entries[e.group(1)] = e.group(2)
    return entries


def amounts(text):
    return sorted(AMOUNT.findall(text))


def check(root=ROOT):
    js_path = root / "i18n.js"
    js = js_path.read_text(encoding="utf-8") if js_path.exists() else ""
    problems = []
    for page, fname in PAGES.items():
        f = root / fname
        if not f.exists():
            continue
        html = f.read_text(encoding="utf-8")

        for attr, value in local_refs(html):
            target = value.split("?")[0].split("#")[0]
            if not target:
                continue
            if not (root / target).exists():
                problems.append(f'{fname}: {attr}="{value}" does not resolve to a file')

        for tag, href in whatsapp_anchors(html):
            if "data-href-alt=" not in tag:
                problems.append(f"{fname}: WhatsApp link without data-href-alt: {href}")

        head = re.search(r"<head>(.*?)</head>", html, re.S)
        if not head or I18N_TAG not in head.group(1):
            problems.append(f"{fname}: <head> does not load i18n.js deferred")

        entries = dict_entries(js, page)
        if entries is None:
            continue
        for k in sorted(entries):
            if k.startswith("__"):
                continue
            inner = element_html(html, k)
            if inner is None:
                continue
            if amounts(inner) != amounts(entries[k]):
                problems.append(f"{fname}: key '{k}' amounts differ between languages")
    return problems


if __name__ == "__main__":
    probs = check()
    for p in probs:
        print(p)
    print("SITE OK" if not probs else f"{len(probs)} problem(s)")
    sys.exit(1 if probs else 0)
