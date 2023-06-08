export interface IAmbient {
  onTraverse?: (child: any) => void | Promise<void>;
  onStart?: (childs: any[]) => void | Promise<void>;
}
