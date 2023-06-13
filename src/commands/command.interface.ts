export interface Command {
  docs: any[];
  execute: (command: string[], db: any) => Promise<any>;
}
