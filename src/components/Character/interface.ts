export interface ICharacter {
  name: string;
  asset: string;
  isMainCharacter?: boolean;
  onDefaultAnimation?: () => void;
  onDefaultPosition?: () => [x: number, y: number, z: number];
  onAddMovement?: (e: any) => void;
}
