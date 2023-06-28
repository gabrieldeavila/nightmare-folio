export interface IInitial {
  onInit?: () => void | Promise<void>;
  defaultRight?: number;
}
