declare module 'rusha' {
  type digest = {
    digest(format: string): string;
  };

  type hash = {
    update: (data: string) => digest;
  };

  function createHash(): hash;
}

declare module '*.json' {
  const data: Record<string, any>;
  export default data;
}
