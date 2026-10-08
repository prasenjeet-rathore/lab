# pi-agent: run Pi in a hardened container for the current project.
#
# Project layout:
#   <project>/                     Pi works here (read-write)
#   <project>/pi-agent/            Agent setup (read-only in the container)
#   <project>/pi-agent/secrets/    Hidden in the container
#   <project>/pi-agent/state/      Hidden in the container (Pi uses it as ~/.pi/agent)
#
# Container runtime: Podman or Docker (or nerdctl). Set PI_RUNTIME to choose one;
# otherwise the first one found is used, Podman first.
#
# Load it from ~/.bashrc (setup.sh does this):
#   source "/path/to/<project>/pi-agent/pi.sh"

_PI_IMAGE="localhost/pi-sandbox:latest"

# Find the project root: the nearest folder above $PWD with pi-agent/Dockerfile.
_pi_root() {
  local d="$PWD"
  while [ "$d" != "/" ]; do
    if [ -f "$d/pi-agent/Dockerfile" ]; then echo "$d"; return 0; fi
    d=$(dirname "$d")
  done
  return 1
}

# Print the container runtime to use.
_pi_runtime() {
  local rt
  for rt in ${PI_RUNTIME:-podman docker nerdctl}; do
    if command -v "$rt" >/dev/null 2>&1; then echo "$rt"; return 0; fi
  done
  echo "pi: no container runtime found. Install Podman or Docker, or set PI_RUNTIME." >&2
  return 1
}

# Print the flags that map the container user to your host user, so files Pi
# writes in the project belong to you.
_pi_user_flags() {
  case "$1" in
    podman)
      echo "--userns=keep-id:uid=1000,gid=1000" ;;
    *)
      # Rootless Docker maps container root to your host user. Rootful Docker
      # needs your own UID and GID inside the container.
      if "$1" info --format '{{.SecurityOptions}}' 2>/dev/null | grep -q rootless; then
        echo "--user 0:0"
      else
        echo "--user $(id -u):$(id -g)"
      fi ;;
  esac
}

pi() {
  local root agent name sub rt
  root=$(_pi_root) || { echo "pi: no pi-agent/ folder in this folder or above." >&2; return 1; }
  if [ "$root" = "$HOME" ]; then
    echo "pi: your home folder cannot be a project." >&2; return 1
  fi
  rt=$(_pi_runtime) || return 1
  agent="$root/pi-agent"
  name=$(basename "$root")
  sub="${PWD#"$root"}"
  mkdir -p "$agent/secrets" "$agent/state" "$agent/.empty"
  # Docker would create a folder here if the file is missing.
  if [ ! -f "$agent/secrets/auth.json" ]; then
    echo "pi: no API key. Run: bash pi-agent/setup.sh" >&2; return 1
  fi

  # shellcheck disable=SC2046  # the user flags must split into words
  "$rt" run --rm -it --init \
    $(_pi_user_flags "$rt") \
    --cap-drop=ALL \
    --security-opt=no-new-privileges \
    --read-only \
    --tmpfs /home/pi:rw,exec,nosuid,nodev,mode=1777,size=512m \
    --pids-limit=256 --memory=2g --cpus=2 \
    -v "$root:/work/$name:z" \
    -v "$agent:/work/$name/pi-agent:ro,z" \
    -v "$agent/.empty:/work/$name/pi-agent/secrets:ro,z" \
    -v "$agent/.empty:/work/$name/pi-agent/state:ro,z" \
    -v "$agent/state:/home/pi/.pi/agent:z" \
    -v "$agent/config/AGENTS.md:/home/pi/.pi/agent/AGENTS.md:ro,z" \
    -v "$agent/config/settings.json:/home/pi/.pi/agent/settings.json:ro,z" \
    -v "$agent/config/extensions:/home/pi/.pi/agent/extensions:ro,z" \
    -v "$agent/config/skills:/home/pi/.pi/agent/skills:ro,z" \
    -v "$agent/secrets/auth.json:/home/pi/.pi/agent/auth.json:ro,z" \
    -w "/work/$name$sub" \
    "$_PI_IMAGE" "$@"
}

# Rebuild the image from the current project's pi-agent/Dockerfile.
pi-rebuild() {
  local root rt
  root=$(_pi_root) || { echo "pi-rebuild: no pi-agent/ folder found." >&2; return 1; }
  rt=$(_pi_runtime) || return 1
  "$rt" build --pull -t "$_PI_IMAGE" "$root/pi-agent"
}
