export interface GameRulesConfig {
  readonly targetScore: number;
}

export const defaultGameRulesConfig: GameRulesConfig = {
  targetScore: 151,
};
