# Learning Contract Builder setup

This project includes the `learning-contract-builder` skill for both GitHub
Copilot and Codex.

## GitHub Copilot

Open this project as a repository. Copilot automatically discovers the skill
from `.github/skills/learning-contract-builder/`. Ask Copilot for your next
weekly learning contract, or mention `learning-contract-builder` explicitly.

## Codex

The Codex plugin is in `plugins/learning-contract-builder/`, and the local
marketplace catalog is in `.agents/plugins/marketplace.json`.

After opening the project in Codex, restart or refresh the Codex app, open the
Plugins directory, and install or enable **Learning Contract Builder** from
the repository marketplace. If using the Codex CLI, add this repository as a
local marketplace if it is not already listed:

```bash
codex plugin marketplace add /absolute/path/to/this/project
```

Then ask Codex for your next weekly learning contract.

The skill reads the existing files in `contracts/` and `reviews/`, then writes
the next contract to `contracts/cN.md`. Keep those directories in the same
project workspace when using either assistant.
