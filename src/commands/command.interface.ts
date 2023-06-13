type ArgumentDoc = {
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
};

export interface Command {
  docs: Readonly<CommandDoc>;
  execute: (command: Uint8Array[], db: any) => Promise<any>;
}
