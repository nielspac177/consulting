import pathlib
import sys
import tempfile
import unittest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent / "tools"))
import check_i18n  # noqa: E402

INDEX = (
    '<html><body data-page="index">'
    '<h1 data-i="hero.title">Hi</h1><p data-i="hero.lede">Lede</p>'
    '</body></html>'
)
GOOD = (
    'var T = {};\nT.index = {\n'
    '  "__title": "Título",\n  "__desc": "Desc",\n'
    '  "hero.title": "Hola",\n  "hero.lede": "Entrada"\n};\n'
)
MISSING = (
    'var T = {};\nT.index = {\n'
    '  "__title": "Título",\n  "__desc": "Desc",\n'
    '  "hero.title": "Hola"\n};\n'
)
ORPHAN = (
    'var T = {};\nT.index = {\n'
    '  "__title": "Título",\n  "__desc": "Desc",\n'
    '  "hero.title": "Hola",\n  "hero.lede": "Entrada",\n  "old.key": "x"\n};\n'
)
NO_META = (
    'var T = {};\nT.index = {\n'
    '  "hero.title": "Hola",\n  "hero.lede": "Entrada"\n};\n'
)


ORPHAN_PAGE = (
    'var T = {};\nT.index = {\n'
    '  "__title": "Título",\n  "__desc": "Desc",\n'
    '  "hero.title": "Hola",\n  "hero.lede": "Entrada"\n};\n'
    'T.mentoring = {\n'
    '  "__title": "Mentoría",\n  "__desc": "Desc",\n  "hero.title": "Hola"\n};\n'
)


class ParityTest(unittest.TestCase):
    def run_check(self, js):
        with tempfile.TemporaryDirectory() as d:
            root = pathlib.Path(d)
            (root / "index.html").write_text(INDEX, encoding="utf-8")
            (root / "i18n.js").write_text(js, encoding="utf-8")
            return check_i18n.check(root)

    def test_parity_ok(self):
        self.assertEqual(self.run_check(GOOD), [])

    def test_missing_translation(self):
        self.assertIn("index.html: key 'hero.lede' missing in T.index", self.run_check(MISSING))

    def test_orphan_translation(self):
        self.assertIn("index.html: dictionary key 'old.key' has no element", self.run_check(ORPHAN))

    def test_missing_dictionary(self):
        self.assertIn("index.html: no T.index dictionary in i18n.js", self.run_check("var T = {};\n"))

    def test_missing_page_with_dictionary(self):
        self.assertIn(
            "mentoring.html: page file missing but T.mentoring exists",
            self.run_check(ORPHAN_PAGE),
        )

    def test_missing_meta_keys(self):
        problems = self.run_check(NO_META)
        self.assertIn("index.html: T.index lacks __title", problems)
        self.assertIn("index.html: T.index lacks __desc", problems)


if __name__ == "__main__":
    unittest.main()
