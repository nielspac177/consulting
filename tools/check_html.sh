#!/bin/bash
# Validates every page with the Nu HTML checker. Installs vnu-jar 23.4.11 (runs on Java 8+)
# into the git-ignored node_modules/ on first run; newer vnu-jar releases need Java 17.
cd "$(dirname "$0")/.." || exit 1
JAR=node_modules/vnu-jar/build/dist/vnu.jar
if [ ! -f "$JAR" ]; then npm install --no-save --no-package-lock --silent vnu-jar@23.4.11 >/dev/null 2>&1; fi
if [ ! -f "$JAR" ]; then echo "vnu-jar not available"; exit 1; fi
java -jar "$JAR" --errors-only --format text ./*.html && echo "HTML OK"
