export interface TableSkin {
  readonly id: string;
  readonly woodLight: string;
  readonly woodDark: string;
  readonly grainLight: string;
  readonly grainDark: string;
  readonly rim: string;
  readonly vignette: string;
  readonly grainSeed: number;
}

export const walnutTableSkin: TableSkin = {
  id: 'walnut',
  woodLight: '#5A3A24',
  woodDark: '#2E1B10',
  grainLight: '#8A5E3C',
  grainDark: '#1A0E07',
  rim: '#1D110A',
  vignette: 'rgba(0, 0, 0, 0.60)',
  grainSeed: 7,
};
