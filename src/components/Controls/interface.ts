export interface IControl {
  onUpdate?: (time: number, delta: number) => void | Promise<void>;
  onJump?: () => void | Promise<void>;
}
