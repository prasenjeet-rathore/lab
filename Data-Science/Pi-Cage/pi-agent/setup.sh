#!/usr/bin/env bash
# One-time setup for pi-agent. Safe to run again.
#   bash pi-agent/setup.sh
set -euo pipefail

# The project root is the folder above this script, wherever it was cloned.
agent=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
root=$(dirname "$agent")
cd "$root"

# 1. Load the commands in each new terminal (adds the line only once).
# First remove lines for a pi.sh that no longer exists (the project was moved or renamed).
if [ -f ~/.bashrc ]; then
  tmp=$(mktemp)
  while IFS= read -r l || [ -n "$l" ]; do
    if [[ $l =~ ^source\ \"(.*/pi-agent/pi\.sh)\"$ ]] && [ ! -f "${BASH_REMATCH[1]}" ]; then
      echo "Removed from ~/.bashrc: $l"
      continue
    fi
    printf '%s\n' "$l"
  done < ~/.bashrc > "$tmp"
  cat "$tmp" > ~/.bashrc && rm -f "$tmp"
fi

line="source \"$agent/pi.sh\""
if ! grep -qxF "$line" ~/.bashrc 2>/dev/null; then
  echo "$line" >> ~/.bashrc
  echo "Added to ~/.bashrc: $line"
fi

# 2. Build the image.
source "$agent/pi.sh"
pi-rebuild

# 3. Store the API key, unless one is already there (input is hidden).
if [ ! -s "$agent/secrets/auth.json" ]; then
  read -r -p "Provider (deepseek, anthropic, openai, google, openrouter, ...) [deepseek]: " PROVIDER
  PROVIDER=${PROVIDER:-deepseek}
  ( umask 077; mkdir -p "$agent/secrets"
    read -rs -p "API key for $PROVIDER: " KEY; echo
    printf '{\n  "%s": { "type": "api_key", "key": "%s" }\n}\n' "$PROVIDER" "$KEY" \
      > "$agent/secrets/auth.json" )
  if ! grep -q "\"defaultProvider\": \"$PROVIDER\"" "$agent/config/settings.json"; then
    echo "Set defaultProvider and defaultModel for $PROVIDER in pi-agent/config/settings.json."
  fi
fi

echo "Done. Run: source ~/.bashrc && pi"
