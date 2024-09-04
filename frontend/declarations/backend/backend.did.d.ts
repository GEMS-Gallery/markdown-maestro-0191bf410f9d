import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface MarkdownFile {
  'id' : bigint,
  'content' : string,
  'name' : string,
}
export type Result = { 'ok' : bigint } |
  { 'err' : string };
export type Result_1 = { 'ok' : MarkdownFile } |
  { 'err' : string };
export interface _SERVICE {
  'getAllMarkdownFiles' : ActorMethod<[], Array<MarkdownFile>>,
  'getMarkdownFile' : ActorMethod<[bigint], Result_1>,
  'saveMarkdownFile' : ActorMethod<[string, string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
