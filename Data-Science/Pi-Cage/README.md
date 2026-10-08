<div align="center">

<img src="pi-agent/assets/logo.png" alt="pi-cage logo" width="160">

# Pi-Cage

</div>

<p align="center">
  <img alt="pi logo" src="https://pi.dev/logo-auto.svg" width="24">
  <img src="https://img.shields.io/badge/DeepSeek-API-4D6BFE?style=flat" />
  <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/bash-%234EAA25.svg?style=flat&logo=gnubash&logoColor=white" />
  
</p>

<div align="center">

Run the [Pi Agent](https://pi.dev) in a safe container.

</div>

## You need

- Docker or Podman
- An API key

## Set up (one time)

1. Open a terminal in the folder that contains `pi-agent/`.
2. Run these commands:

```bash
bash pi-agent/setup.sh
source ~/.bashrc
```

3. When the script asks, type your provider. To use DeepSeek, push Enter.
4. Paste your API key. Then push Enter.
5. If you do not use DeepSeek, set `defaultProvider` and `defaultModel` in `pi-agent/config/settings.json`.

> The key does not show on the screen. This is correct.

> Pi uses Podman if you have it. Otherwise it uses Docker. To choose, set `PI_RUNTIME=docker` in `~/.bashrc`.

## Use

Run these commands in the project folder or in a subfolder.

| Command | Result |
|---|---|
| `pi` | Start Pi |
| `pi --continue` | Continue the last session |
| `pi --tools read,grep,find,ls` | Start Pi in read-only mode |
| `pi-rebuild` | Update Pi and get security fixes. Do this each week. |

## Settings

Edit the files in `pi-agent/config/`. Pi cannot change these files.

| To change | Edit | Then |
|---|---|---|
| The rules for the model | `AGENTS.md` | Restart Pi |
| The model or thinking level | `settings.json` | Restart Pi |
| The packages | `packages` in `settings.json` | Restart Pi |
| The extensions | Add a `.ts` file to `extensions/` | Type `/reload` |
| The skills | Add a folder with `SKILL.md` to `skills/` | Type `/reload` |

> `pi install` cannot add a package. You must add it to `settings.json`. This is intentional.

<details>
<summary><b>Other tasks</b></summary>

| Task | Command |
|---|---|
| Change the API key | `rm pi-agent/secrets/auth.json && bash pi-agent/setup.sh` |
| Delete all sessions | `rm -rf pi-agent/state/sessions` |
| Examine a package before you add it | `grep -rnE 'fetch\|http\|exec\|spawn' pi-agent/state/npm/node_modules/<name>` |

</details>
