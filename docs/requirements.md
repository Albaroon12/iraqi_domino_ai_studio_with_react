# Requirements — Iraqi Domino
Status: DRAFT v0.1

## Product
Premium Iraqi Domino game in Flutter: realistic wooden table, ivory tiles,
smooth animations, Arabic-first RTL UI (Modern Standard Arabic), English LTR.

## Platforms
- Targets: Android and iOS (mobile only). No desktop target for now.
- Orientation: portrait only.
- Development machine: Windows; testing on Android emulator or a physical phone.
- Architecture must still allow other platforms later.

## Functional Requirements
### Modes
- 2 players: human vs human, human vs computer, online.
- 4 players (2 teams): human/computer combinations, online.
- Azneef: future, rules to be supplied by owner.

### Rules
- As defined in game_rules.md (single source of truth).
- Configurable via GameRulesConfig (target score at minimum).

### AI
- Legal-move detection, board awareness, played-tile tracking,
  team play (4 players).
- Levels: Easy, Medium, Hard, Expert. Deterministic, testable rules-based.

### Online (Phase 7)
- Accounts, guest mode, profiles, friends, invitations, private rooms,
  public matchmaking, room codes, real-time sync, reconnection,
  server-authoritative validation, anti-cheat, connection status.

### Future
- Virtual economy, skins, shop, tournaments, leaderboards.
- Real money / prizes: NOT implemented without legal, platform, payment
  and age-restriction review. Virtual currency kept separate.

## Non-Functional Requirements
- Game engine in pure Dart, independent of UI, fully unit-testable.
- Separation: rules, engine, AI, rendering, UI, networking.
- No backend or subscription cost in early phases.
- No package added without a stated reason.
- Tiles readable at all screen sizes; no flat rectangles as final art.
- Documentation updated whenever architecture or requirements change.

## Working Process
- One phase at a time, owner approval before each next phase.
- Full code per file with exact paths; build/test commands each step.
