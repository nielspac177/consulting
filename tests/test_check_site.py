import pathlib
import sys
import tempfile
import unittest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent / "tools"))
import check_site  # noqa: E402

WA_OK = (
    '<a href="https://wa.me/51993126398?text=Hello" '
    'data-href-alt="https://wa.me/51993126398?text=Hola">WhatsApp</a>'
)
WA_BAD = '<a href="https://wa.me/51993126398?text=Hello">WhatsApp</a>'


def page(css="style.css", wa=WA_OK, price="S/ 80"):
    return (
        '<!doctype html>\n<html lang="en">\n<head>\n'
        f'<link rel="stylesheet" href="{css}">\n'
        '<script src="i18n.js" defer></script>\n'
        '</head>\n<body data-page="index" data-lang="en">\n'
        '<h1 data-i="hero.title">Hi</h1>\n'
        f'<span class="price" data-i="t1.price">{price}</span>\n'
        f'{wa}\n'
        '</body>\n</html>\n'
    )


def dictionary(price="S/ 80"):
    return (
        'var T = {};\nT.index = {\n'
        '  "__title": "Título",\n  "__desc": "Desc",\n'
        '  "hero.title": "Hola",\n'
        f'  "t1.price": "{price}"\n'
        '};\n'
    )


class SiteTest(unittest.TestCase):
    def run_check(self, html, js=None):
        with tempfile.TemporaryDirectory() as d:
            root = pathlib.Path(d)
            (root / "index.html").write_text(html, encoding="utf-8")
            (root / "i18n.js").write_text(js or dictionary(), encoding="utf-8")
            (root / "style.css").write_text("body{}", encoding="utf-8")
            return check_site.check(root)

    def test_site_ok(self):
        self.assertEqual(self.run_check(page()), [])

    def test_broken_internal_link(self):
        self.assertIn(
            'index.html: href="missing.css" does not resolve to a file',
            self.run_check(page(css="missing.css")),
        )

    def test_whatsapp_without_alternate(self):
        problems = self.run_check(page(wa=WA_BAD))
        self.assertIn(
            "index.html: WhatsApp link without data-href-alt: "
            "https://wa.me/51993126398?text=Hello",
            problems,
        )

    def test_missing_i18n_script(self):
        html = page().replace('<script src="i18n.js" defer></script>\n', "")
        self.assertIn(
            "index.html: <head> does not load i18n.js deferred", self.run_check(html))

    def test_amounts_differ(self):
        problems = self.run_check(page(price="S/ 80"), js=dictionary(price="S/ 90"))
        self.assertIn("index.html: key 't1.price' amounts differ between languages", problems)


if __name__ == "__main__":
    unittest.main()
