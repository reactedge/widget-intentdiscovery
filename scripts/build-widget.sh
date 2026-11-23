#!/bin/bash
set -euo pipefail

WIDGET_NAME="${1:?Usage: build-widget.sh <widget-name>}"
VERSION="$(node -p "require('./vite_project/package.json').version")"
FILE="www/widget-${WIDGET_NAME}@${VERSION}.iife.js"
MANIFEST="www/widget-${WIDGET_NAME}.manifest.json"

if [[ ! -f "$FILE" || ! -f "$MANIFEST" ]]; then
  echo "Missing widget bundle or manifest for $WIDGET_NAME" >&2
  exit 1
fi

HASH="$(node -p 'require("./" + process.argv[1]).hash' "$MANIFEST")"
{
  echo "version=$VERSION"
  echo "hash=$HASH"
  echo "file=$FILE"
} >> "$GITHUB_OUTPUT"
