export interface ISetOptions<TOptions = any> {
  setOptions(options: TOptions): void;
}

export const SetOptions: keyof ISetOptions = 'setOptions';
