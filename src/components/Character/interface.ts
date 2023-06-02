export interface ICharacter {
  name: string;
  asset: string;
  isMainCharacter?: boolean;
  onDefaultAnimation?: () => void;
}
