import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface DocSection {
  'id' : bigint,
  'title' : string,
  'content' : string,
}
export type Result = { 'ok' : bigint } |
  { 'err' : string };
export type Result_1 = { 'ok' : DocSection } |
  { 'err' : string };
export interface _SERVICE {
  'getAllDocSections' : ActorMethod<[], Array<DocSection>>,
  'getDocSection' : ActorMethod<[bigint], Result_1>,
  'saveDocSection' : ActorMethod<[string, string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
