#!/bin/bash
# Validates every page with the Nu HTML checker (vnu.jar via npx, Java 11+).
cd "$(dirname "$0")/.." || exit 1
JAR=$(npx --yes --package vnu-jar node -e 'console.log(require("vnu-jar"))' 2>/dev/null)
if [ ! -f "$JAR" ]; then echo "vnu-jar not available"; exit 1; fi
java -jar "$JAR" --errors-only --format text ./*.html && echo "HTML OK"
