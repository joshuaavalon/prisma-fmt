export interface Transform {
  model: (input: string) => string;
  field: (input: string) => string;
}

export interface Line {
  toString(transform: Transform): string;
}

export interface Block {
  toString(transform: Transform): string;
  append(line: string): void;
}
