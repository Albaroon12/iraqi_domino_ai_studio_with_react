# Game Rules Specification — Iraqi Domino
Status: DRAFT v0.1 (awaiting owner approval)
Items marked **[ASSUMED]** were not explicitly confirmed and need owner review.

## 1. Tile Set
- Double-six set: 28 tiles (0-0 to 6-6).
- The double 6-6 is called "Dooshaysh" (display term TBD).

## 2. Players and Teams
- Modes: 2 players, 4 players.
- 4 players: two teams; partners sit opposite each other.
- Direction of play: counter-clockwise.

## 3. Dealing
- Each player receives 7 tiles (2 players or 4 players).
- Tiles are dealt randomly in the pattern 2, then 2, then 3 per player.
- 2 players: the remaining 14 tiles form the draw pile (boneyard).
- 4 players: all 28 tiles are dealt; no draw pile.
- After a blocked round, the player who blocked the game deals (draws 2-2-3).

## 4. Starting a Round
### First round of a match
- 4 players: holder of 6-6 starts and MUST open with 6-6.
- 2 players: holder of the highest double starts and must open with it
  (6-6, else 5-5, else 4-4, ... down to 0-0).
- 2 players, no double held by either player: players draw from the
  boneyard until a double appears. **[ASSUMED]** alternate draws, one tile
  at a time, starting from a random player.

### Later rounds
- The winner of the previous round starts and may open with any tile.
- After a blocked round, the winner is the player with the lowest total
  (see section 7), who also starts.

## 5. Placing Tiles
- Single line of play (two open ends). No spinner in standard mode.
- A double is placed crosswise and does NOT create a branch.
- A tile may be played only if one of its halves matches an open end.
- Spinner/branching belongs to the future "Azneef" mode (rules TBD).

## 6. No Playable Tile
- 4 players: the player says "I have none" / passes; turn moves on.
  **[ASSUMED]** passing is allowed only when no legal move exists
  (playing is compulsory).
- 2 players: the player draws from the boneyard.
  **[ASSUMED]** draws until a playable tile is obtained; if the boneyard
  is empty, the player passes.
- Passing and drawing are AUTOMATIC: when the player on turn has no legal
  move, the game says "I have none" / passes (or draws with two players)
  after a short delay. The player never presses a button for it.
- Legal moves are computed only for the player whose turn it is, because
  hands change after every move.

## 7. End of Round
### 7.1 Domino (out)
- First player to play all tiles wins the round.
- Round score = total pips of the opponents' remaining tiles.
  - 4 players: only the two opposing players' pips (not the partner's).
  - 2 players: the opponent's pips.

### 7.2 Blocked game
- A game is blocked when no player can play (and, in 2-player mode,
  the boneyard is empty).
- Each player's remaining pip total is compared (pips, not tile count).
- The lowest total wins.
  - 4 players: the lowest player's team wins the round and scores the pips
    of the two opposing players only.
  - 2 players: the lowest wins and scores the opponent's pips.

### 7.3 Ties on a block
- 4 players:
  - Tie between two players of the SAME team for lowest: that team wins
    normally.
  - Tie between players of DIFFERENT teams for lowest: the round is
    "burned" (no points, redeal).
- 2 players: tie = burned round.
- Burned round: no points; the player who blocked the game deals; the
  holder of 6-6 starts (2 players: highest double rule applies).
- Who starts after a same-team tie win: **[ASSUMED]** the tied player
  closest to the blocker in play order (counter-clockwise).

## 8. Match End
- Default target: 151 points (2 and 4 players).
- Target is configurable before the match (e.g. 200, 250).
- First side to reach or exceed the target wins the match.
- Online games: the target score is a ROOM setting chosen by the room
  creator before the match. Joining players see it but cannot change it.
  The app-wide setting is only the default for local games and for rooms
  the player creates.

## 9. Configurable Rules (GameRulesConfig)
- targetScore (default 151)
- Other options (winner / block handling) to be defined in Phase 2.

## 10. Out of Scope / Pending
- Azneef mode rules (owner will provide later).
- Final Arabic UI terminology (Modern Standard Arabic for now).
- Exact value of the match score if both sides cross target in one round
  (not discussed; with the "winner scores" rule only one side can score
  per round, so this cannot occur).
