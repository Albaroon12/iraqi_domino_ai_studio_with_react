export type LanguageCode = 'ar' | 'en';

export interface Translations {
  appTitle: string;
  tileGallery: string;
  tablePreview: string;
  skinIvory: string;
  skinEbony: string;
  skinRuby: string;
  play: string;
  settings: string;
  chooseMode: string;
  modeTwoPlayers: string;
  modeTwoPlayersDesc: string;
  modeFourPlayers: string;
  modeFourPlayersDesc: string;
  modeAzneef: string;
  comingSoon: string;
  targetScoreLabel: (score: number) => string;
  settingsLanguage: string;
  settingsTargetScore: string;
  settingsTileSkin: string;
  settingsSound: string;
  playerYou: string;
  playerPartner: string;
  opponentRight: string;
  opponentLeft: string;
  opponentSingle: string;
  teamUs: string;
  teamThem: string;
  targetShort: string;
  boneyardCount: (count: number) => string;
  weWonRound: string;
  theyWonRound: string;
  roundBurned: string;
  reasonDomino: string;
  reasonBlocked: string;
  reasonBurned: string;
  roundPoints: (points: number) => string;
  totalsLine: (ours: number, theirs: number) => string;
  nextRound: string;
  youStartRound: (piece: string) => string;
  otherStartsRound: (name: string, piece: string) => string;
  redeal: string;
  youStartRoundFree: string;
  otherStartsRoundFree: (name: string) => string;
  saysNoTiles: (name: string) => string;
  passesTurn: (name: string) => string;
  drawsTile: (name: string) => string;
  resultsButton: string;
  resultsHistoryTitle: string;
  noRoundsYet: string;
  roundNumberLabel: (n: number) => string;
  closeLabel: string;
}

const ar: Translations = {
  appTitle: 'الدومينو العراقي',
  tileGallery: 'معرض القطع',
  tablePreview: 'معاينة الطاولة',
  skinIvory: 'عاجي',
  skinEbony: 'أبنوس',
  skinRuby: 'ياقوتي',
  play: 'العب',
  settings: 'الإعدادات',
  chooseMode: 'اختر نمط اللعب',
  modeTwoPlayers: 'لاعبان',
  modeTwoPlayersDesc: 'مواجهة مباشرة، سبع قطع لكل لاعب',
  modeFourPlayers: 'أربعة لاعبين',
  modeFourPlayersDesc: 'فريقان، وشريكك يجلس مقابلك',
  modeAzneef: 'أزنيف',
  comingSoon: 'قريباً',
  targetScoreLabel: (score) => `الهدف: ${score} نقطة`,
  settingsLanguage: 'اللغة',
  settingsTargetScore: 'هدف النقاط (الافتراضي للعب المحلي)',
  settingsTileSkin: 'شكل القطع',
  settingsSound: 'الأصوات',
  playerYou: 'أنت',
  playerPartner: 'شريكك',
  opponentRight: 'الخصم الأيمن',
  opponentLeft: 'الخصم الأيسر',
  opponentSingle: 'الخصم',
  teamUs: 'فريقنا',
  teamThem: 'فريقهم',
  targetShort: 'الهدف',
  boneyardCount: (count) => `السحب: ${count}`,
  weWonRound: 'فزتم بالجولة',
  theyWonRound: 'فاز الخصم بالجولة',
  roundBurned: 'جولة محروقة',
  reasonDomino: 'أنهى لاعب كل قطعه',
  reasonBlocked: 'انقفلت اللعبة، والأقل نقاطاً يفوز',
  reasonBurned: 'تعادل عند القفل، بدون نقاط وتُعاد الجولة',
  roundPoints: (points) => `نقاط الجولة: ${points}`,
  totalsLine: (ours, theirs) => `المجموع: ${ours} مقابل ${theirs}`,
  nextRound: 'الجولة التالية',
  youStartRound: (piece) => `تبدأ الجولة بالقطعة ${piece}`,
  otherStartsRound: (name, piece) => `${name} يبدأ الجولة بالقطعة ${piece}`,
  redeal: 'إعادة التوزيع',
  youStartRoundFree: 'تبدأ الجولة بأي قطعة',
  otherStartsRoundFree: (name) => `${name} يبدأ الجولة`,
  saysNoTiles: (name) => `${name}: ما عندي`,
  passesTurn: (name) => `${name}: عبور`,
  drawsTile: (name) => `${name}: سحب قطعة`,
  resultsButton: 'النتائج',
  resultsHistoryTitle: 'نتائج الجولات السابقة',
  noRoundsYet: 'لم تكتمل أي جولة بعد',
  roundNumberLabel: (n) => `الجولة ${n}`,
  closeLabel: 'إغلاق',
};

const en: Translations = {
  appTitle: 'Iraqi Domino',
  tileGallery: 'Tile Gallery',
  tablePreview: 'Table Preview',
  skinIvory: 'Ivory',
  skinEbony: 'Ebony',
  skinRuby: 'Ruby',
  play: 'Play',
  settings: 'Settings',
  chooseMode: 'Choose game mode',
  modeTwoPlayers: 'Two players',
  modeTwoPlayersDesc: 'Head to head, seven tiles each',
  modeFourPlayers: 'Four players',
  modeFourPlayersDesc: 'Two teams, your partner sits opposite you',
  modeAzneef: 'Azneef',
  comingSoon: 'Coming soon',
  targetScoreLabel: (score) => `Target: ${score} points`,
  settingsLanguage: 'Language',
  settingsTargetScore: 'Target score (default for local games)',
  settingsTileSkin: 'Tile style',
  settingsSound: 'Sound',
  playerYou: 'You',
  playerPartner: 'Your partner',
  opponentRight: 'Right opponent',
  opponentLeft: 'Left opponent',
  opponentSingle: 'Opponent',
  teamUs: 'Us',
  teamThem: 'Them',
  targetShort: 'Target',
  boneyardCount: (count) => `Draw pile: ${count}`,
  weWonRound: 'You won the round',
  theyWonRound: 'The opponent won the round',
  roundBurned: 'Burned round',
  reasonDomino: 'A player played all their tiles',
  reasonBlocked: 'The game is blocked; the lowest total wins',
  reasonBurned: 'Tie on a block: no points, the round is replayed',
  roundPoints: (points) => `Round points: ${points}`,
  totalsLine: (ours, theirs) => `Total: ${ours} vs ${theirs}`,
  nextRound: 'Next round',
  youStartRound: (piece) => `You start the round with ${piece}`,
  otherStartsRound: (name, piece) => `${name} starts the round with ${piece}`,
  redeal: 'Deal again',
  youStartRoundFree: 'You start the round with any piece',
  otherStartsRoundFree: (name) => `${name} starts the round`,
  saysNoTiles: (name) => `${name}: I have none`,
  passesTurn: (name) => `${name}: passes`,
  drawsTile: (name) => `${name}: draws a tile`,
  resultsButton: 'Results',
  resultsHistoryTitle: 'Previous Rounds',
  noRoundsYet: 'No completed rounds yet',
  roundNumberLabel: (n) => `Round ${n}`,
  closeLabel: 'Close',
};

export function getTranslations(lang: LanguageCode): Translations {
  return lang === 'en' ? en : ar;
}

export function getTileSkinName(l10n: Translations, skinId: string): string {
  switch (skinId) {
    case 'ebony':
      return l10n.skinEbony;
    case 'ruby':
      return l10n.skinRuby;
    default:
      return l10n.skinIvory;
  }
}
