# CLAUDE.md — Iraqi Domino

This file is loaded automatically at the start of every Claude Code session.

## First thing, every session

1. Read `AI_HANDOFF.md` in the repo root completely. It is the shared memory between all AI agents and the owner: current phase, code map, known issues, decisions, inbox and change log.
2. Read the files in `docs/` if your task touches rules, architecture or scope.
3. Tell the owner (in Arabic) in 2-3 lines where the project stands and what you understood from the last Change Log entries. Then wait for the task.

## Last thing, every reply that changes something

Before you finish, update `AI_HANDOFF.md`:
- Add ONE new entry at the top of the Change Log, using the template inside the file.
- Update the status, known-issues or decisions sections if they changed.
- Update `docs/` too if rules, architecture or requirements changed.
- Write exactly which commands you ran (`flutter analyze`, `flutter test`) and their real result. If you did not run them, write NOT RUN.
- Answer any OPEN message in the Inbox addressed to you.

## Short rules (full list in AI_HANDOFF.md)

- Talk to the owner in Arabic. Code, comments and docs are in English.
- One phase at a time; only the owner approves moving to the next phase.
- No new package without a stated reason.
- `lib/engine/` stays pure Dart (no Flutter imports).
- Use `package:material_ui/material_ui.dart`, not `package:flutter/material.dart`.
- Do not edit generated `lib/l10n/app_localizations*.dart`; edit the `.arb` files and run `flutter gen-l10n`.
- Never invent Azneef rules. Never add real-money features.
