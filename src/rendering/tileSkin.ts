export interface TileSkin {
  readonly id: 'ivory' | 'ebony' | 'ruby';
  readonly bodyLight: string;
  readonly bodyDark: string;
  readonly bevelLight: string;
  readonly bevelDark: string;
  readonly grooveColor: string;
  readonly grooveEdge: string;
  readonly pipHighlight: string;
  readonly pipDark: string;
  readonly pipRim: string;
}

export const ivorySkin: TileSkin = {
  id: 'ivory',
  bodyLight: '#FBF6E9',
  bodyDark: '#E8DEC5',
  bevelLight: 'rgba(255, 255, 255, 0.80)',
  bevelDark: 'rgba(138, 117, 80, 0.33)',
  grooveColor: 'rgba(0, 0, 0, 0.40)',
  grooveEdge: 'rgba(255, 255, 255, 0.67)',
  pipHighlight: '#3C3C3C',
  pipDark: '#050505',
  pipRim: 'rgba(255, 255, 255, 0.67)',
};

export const ebonySkin: TileSkin = {
  id: 'ebony',
  bodyLight: '#3A3A3A',
  bodyDark: '#0F0F0F',
  bevelLight: 'rgba(255, 255, 255, 0.33)',
  bevelDark: 'rgba(0, 0, 0, 0.53)',
  grooveColor: 'rgba(0, 0, 0, 0.67)',
  grooveEdge: 'rgba(255, 255, 255, 0.20)',
  pipHighlight: '#FFFFFF',
  pipDark: '#D9CFB4',
  pipRim: 'rgba(0, 0, 0, 0.40)',
};

export const rubySkin: TileSkin = {
  id: 'ruby',
  bodyLight: '#C4443A',
  bodyDark: '#7A1F19',
  bevelLight: 'rgba(255, 255, 255, 0.40)',
  bevelDark: 'rgba(48, 0, 0, 0.53)',
  grooveColor: 'rgba(0, 0, 0, 0.53)',
  grooveEdge: 'rgba(255, 255, 255, 0.27)',
  pipHighlight: '#FFFFFF',
  pipDark: '#F1E6CC',
  pipRim: 'rgba(0, 0, 0, 0.33)',
};

export const allTileSkins: readonly TileSkin[] = [ivorySkin, ebonySkin, rubySkin];

export function tileSkinById(id: string): TileSkin {
  return allTileSkins.find((s) => s.id === id) ?? ivorySkin;
}
