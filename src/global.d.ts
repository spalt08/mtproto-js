
declare module 'rusha' {
  function createHash(): any;
  function digest(data: any): string;
  function digestFromString(strityng: string): string;
}

declare module '*.json' {
  const data: Record<string, any>;
  export default data;
}
