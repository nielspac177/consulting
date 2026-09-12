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

`tools/check_html.sh` y `tools/screenshots.sh` instalan `vnu-jar` y `puppeteer-core` en el directorio `node_modules/` (ignorado por git) la primera vez que se ejecutan, y requieren Java 11 o superior, Node y Google Chrome en su ruta estándar de macOS (`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`).

```bash
/usr/bin/python3 -m unittest tests/test_check_i18n.py
/usr/bin/python3 -m unittest tests/test_check_site.py
/usr/bin/python3 tools/check_i18n.py
/usr/bin/python3 tools/check_site.py
tools/check_html.sh
tools/check_links.sh
tools/screenshots.sh
tools/lighthouse.sh
```

## Número de colegiatura

El número del Colegio Médico del Perú va en los `<span>` vacíos que ya están en su lugar: `<span id="cmp">` (en `index.html` y `telesalud.html`) y `<span id="cmp-footer">` (en las cuatro páginas). Escriba el número dentro de cada `<span>`; no hace falta ningún otro cambio.

## Publicación

GitHub Pages desde la rama `main` (raíz). Vista previa para redes: `tools/og/render.sh`.
