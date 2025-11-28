export enum ClockSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  FULLSCREEN = 'fullscreen'
}

export enum BackgroundTheme {
  BLACK = 'black',
  WHITE = 'white',
  NEBULA = 'nebula'
}

export interface ClockConfig {
  color: string;
  size: ClockSize;
  gmtOffset: number; // Hours offset from UTC
  background: BackgroundTheme;
}

export const AVAILABLE_COLORS = [
  { name: 'Vermelho', value: '#ef4444' },     // red-500
  { name: 'Verde', value: '#22c55e' },        // green-500
  { name: 'Azul', value: '#3b82f6' },         // blue-500
  { name: 'Ciano', value: '#06b6d4' },        // cyan-500
  { name: 'Roxo', value: '#a855f7' },         // purple-500
  { name: 'Âmbar', value: '#f59e0b' },        // amber-500
  { name: 'Branco', value: '#ffffff' },       // white
  { name: 'Preto', value: '#000000' },        // black (useful for white bg)
];

export const GMT_OFFSETS = Array.from({ length: 27 }, (_, i) => i - 12); // -12 to +14