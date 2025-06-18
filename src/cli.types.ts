export type InputRow = {
  id: string;
  json: unknown[];
};

export type OutputRow = {
  id: string;
  json: string;
  is_valid: boolean;
};
