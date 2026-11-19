# Iraqi Domino

A React + TypeScript + Vite web application for **Iraqi Domino** (الدومينو العراقي), rewritten from the original Flutter project while preserving all core game rules, visual design, and layout behavior.

## Features

- **Game Modes**: 2-player (with 14-tile boneyard) and 4-player (2 teams, opposite partners).
- **Authentic Iraqi Domino Rules**:
  - 28-tile double-six set (`0-0` to `6-6`) dealt in the `2-2-3` pattern.
  - Highest double opens the first round (`6-6` in 4-player mode); previous round winner opens subsequent rounds freely.
  - Automatic drawing (2-player) and passing when no legal moves exist.
  - Domino, blocked-game lowest-pip scoring (opponents' pips only), and burned-round tie handling.
  - 30-second human turn timer with automatic fallback play.
- **Visual Craft**:
  - Procedural walnut wood table background (`WoodTable`).
  - Square carved wooden board with green felt and gold trim (`BoardFrame`).
  - Fixed-size serpentine tile layout (`SerpentineLayout`) with crosswise doubles and gold ghost drop targets.
  - Three tile skins: Ivory (`عاجي`), Ebony (`أبنوس`), and Ruby (`ياقوتي`).
- **Localization & Persistence**:
  - Arabic-first RTL UI and English LTR UI (`العربية` / `English`).
  - Configurable default target score (`151`, `200`, `250`), tile skin, and sound toggle saved in `localStorage`.

## Development

```bash
npm install
npm run dev
```

## Build & Typecheck

```bash
npm run lint
npm run build
```
