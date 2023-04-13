import type { Principal } from '@dfinity/principal';
export type AccountIdentifier = Array<number>;
export interface Block {
  'transaction' : Transaction,
  'timestamp' : Timestamp,
  'parent_hash' : [] | [Array<number>],
}
export type BlockIndex = bigint;
export interface BlockRange { 'blocks' : Array<Block> }
export interface GetBlocksArgs { 'start' : BlockIndex, 'length' : bigint }
export type GetBlocksError = {
    'BadFirstBlockIndex' : {
      'requested_index' : BlockIndex,
      'first_valid_index' : BlockIndex,
    }
  } |
  { 'Other' : { 'error_message' : string, 'error_code' : bigint } };
export type GetBlocksResult = { 'Ok' : BlockRange } |
  { 'Err' : GetBlocksError };
export type Memo = bigint;
export type Operation = {
    'Approve' : {
      'fee' : Tokens,
      'from' : AccountIdentifier,
      'allowance_e8s' : bigint,
      'expires_at' : [] | [Timestamp],
      'spender' : AccountIdentifier,
    }
  } |
  { 'Burn' : { 'from' : AccountIdentifier, 'amount' : Tokens } } |
  { 'Mint' : { 'to' : AccountIdentifier, 'amount' : Tokens } } |
  {
    'Transfer' : {
      'to' : AccountIdentifier,
      'fee' : Tokens,
      'from' : AccountIdentifier,
      'amount' : Tokens,
    }
  } |
  {
    'TransferFrom' : {
      'to' : AccountIdentifier,
      'fee' : Tokens,
      'from' : AccountIdentifier,
      'amount' : Tokens,
      'spender' : AccountIdentifier,
    }
  };
export interface Timestamp { 'timestamp_nanos' : bigint }
export interface Tokens { 'e8s' : bigint }
export interface Transaction {
  'memo' : Memo,
  'icrc1_memo' : [] | [Array<number>],
  'operation' : [] | [Operation],
  'created_at_time' : Timestamp,
}
export interface _SERVICE {
  'get_blocks' : (arg_0: GetBlocksArgs) => Promise<GetBlocksResult>,
}