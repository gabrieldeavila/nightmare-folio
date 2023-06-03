export interface IControl {
  onUpdate?: (time: number, delta: number) => void;
}
