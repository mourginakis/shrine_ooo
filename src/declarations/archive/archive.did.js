export const idlFactory = ({ IDL }) => {
    const BlockIndex = IDL.Nat64;
    const GetBlocksArgs = IDL.Record({
      'start' : BlockIndex,
      'length' : IDL.Nat64,
    });
    const Memo = IDL.Nat64;
    const Tokens = IDL.Record({ 'e8s' : IDL.Nat64 });
    const AccountIdentifier = IDL.Vec(IDL.Nat8);
    const Timestamp = IDL.Record({ 'timestamp_nanos' : IDL.Nat64 });
    const Operation = IDL.Variant({
      'Approve' : IDL.Record({
        'fee' : Tokens,
        'from' : AccountIdentifier,
        'allowance_e8s' : IDL.Int,
        'expires_at' : IDL.Opt(Timestamp),
        'spender' : AccountIdentifier,
      }),
      'Burn' : IDL.Record({ 'from' : AccountIdentifier, 'amount' : Tokens }),
      'Mint' : IDL.Record({ 'to' : AccountIdentifier, 'amount' : Tokens }),
      'Transfer' : IDL.Record({
        'to' : AccountIdentifier,
        'fee' : Tokens,
        'from' : AccountIdentifier,
        'amount' : Tokens,
      }),
      'TransferFrom' : IDL.Record({
        'to' : AccountIdentifier,
        'fee' : Tokens,
        'from' : AccountIdentifier,
        'amount' : Tokens,
        'spender' : AccountIdentifier,
      }),
    });
    const Transaction = IDL.Record({
      'memo' : Memo,
      'icrc1_memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'operation' : IDL.Opt(Operation),
      'created_at_time' : Timestamp,
    });
    const Block = IDL.Record({
      'transaction' : Transaction,
      'timestamp' : Timestamp,
      'parent_hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    });
    const BlockRange = IDL.Record({ 'blocks' : IDL.Vec(Block) });
    const GetBlocksError = IDL.Variant({
      'BadFirstBlockIndex' : IDL.Record({
        'requested_index' : BlockIndex,
        'first_valid_index' : BlockIndex,
      }),
      'Other' : IDL.Record({
        'error_message' : IDL.Text,
        'error_code' : IDL.Nat64,
      }),
    });
    const GetBlocksResult = IDL.Variant({
      'Ok' : BlockRange,
      'Err' : GetBlocksError,
    });
    return IDL.Service({
      'get_blocks' : IDL.Func([GetBlocksArgs], [GetBlocksResult], ['query']),
    });
  };
  export const init = ({ IDL }) => { return []; };