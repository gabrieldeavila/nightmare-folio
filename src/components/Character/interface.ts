export interface ICharacter {
  name: string;
  asset: string;
  characterRotationPI: number;
  isMainCharacter?: boolean;
  onDefaultAnimation?: () => void;
  onDefaultPosition?: (name: string) => [x: number, y: number, z: number];
  onAddMovement?: (e: any, name: string) => void;
  onAfterMainSetted?: (newChar: any, physics: any) => void;
}
