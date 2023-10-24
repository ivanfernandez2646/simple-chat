export type UnPromisifiedResponse<T> = Partial<{
  [k in keyof T]: UnPromisify<T[k]>;
}>;
type UnPromisify<T> = T extends Promise<infer U> ? U : T;
