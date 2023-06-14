export type ArgumentDoc = {
  name: string;
  type: string;
  key_spec_index?: number;
  flags?: ReadonlyArray<string>;
};

type SubcommandDoc = {
  summary: string;
  since: string;
  group: string;
  complexity: string;
  arguments: ReadonlyArray<Readonly<ArgumentDoc>>;
};

export type CommandDoc = {
  summary: string;
  since: string;
  complexity: string;
  group: string;
  doc_flags?: string[];
  deprecated_since?: string;
  history?: ReadonlyArray<[string, string]>;
  subcommands?: ReadonlyArray<Readonly<[string, Readonly<SubcommandDoc>]>>;
  arguments?: ReadonlyArray<Readonly<ArgumentDoc>>;
};

// type Response = Uint8Array | number | string | number | null | Array<Response>

export type CommandError = {
  type: "error" | "argsamounterror";
  message?: string;
};

export interface Command {
  docs: Readonly<CommandDoc>;
  name: string;
  execute: (command: Uint8Array[], db: Deno.Kv) => Promise<any | CommandError>;
}
