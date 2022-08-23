// eslint-disable-next-line @typescript-eslint/ban-types
export type Rule<T = {}> = {
  id: string;
  disabled?: boolean;
  name?: string;
  type?: string;
  baseUrl: string;
} & {
  [Property in keyof T]: T[Property];
}

export type BaseRule<T = any> = Partial<Rule<T>> & {
  baseUrl: string;
}