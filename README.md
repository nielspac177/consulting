# Sitio de consultoría, mentoría y telesalud

Sitio estático de Niels Pacheco-Barrios, MD. Sin dependencias ni proceso de construcción: HTML, CSS y JavaScript simple.

## Estructura

- `index.html`, `mentoring.html`, `consulting.html`, `telesalud.html`: páginas (telesalud está escrita en español; el resto en inglés).
- `style.css`: sistema de diseño.
- `i18n.js`: diccionarios `T.<página>` con el otro idioma de cada página y la lógica del botón de idioma.
- `assets/`: foto, favicon y vista previa para redes.
- `tools/`: verificaciones.

## Editar precios o textos

1. Cambie el texto en la página (idioma de origen) y en el diccionario correspondiente de `i18n.js` (mismo `data-i`).
2. Ejecute `/usr/bin/python3 tools/check_i18n.py` para confirmar la paridad de claves.

## Verificaciones

```bash
/usr/bin/python3 -m unittest tests/test_check_i18n.py
/usr/bin/python3 tools/check_i18n.py
tools/check_html.sh
tools/check_links.sh
tools/screenshots.sh
tools/lighthouse.sh
```

## Publicación

GitHub Pages desde la rama `main` (raíz). Vista previa para redes: `tools/og/render.sh`.
