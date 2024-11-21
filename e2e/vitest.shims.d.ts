declare module 'vitest' {
  export interface ProvidedContext {
    URL_BASE: string;
  }
}

// mark this file as a module so augmentation works correctly
export {};
