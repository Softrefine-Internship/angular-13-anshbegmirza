export interface Tile {
  // type: string;
  x: number;
  y: number;
  z: number;
  id?: string | number;
  type: 'text' | 'dropdown' | 'image' | 'timer';
  label?: string;
  value?: any;
  options?: { value: string; viewValue: string };
  imageSrc?: string;
}
