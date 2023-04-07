import Prelude   "mo:base/Prelude";
import Blob      "mo:base/Blob";
import Array     "mo:base/Array";
import Nat8      "mo:base/Nat8";
import Nat32     "mo:base/Nat32";
import Text      "mo:base/Text";
import Principal "mo:base/Principal";


// A module for interacting with the Ledger Canister
// NNS Ledger: ryjl3-tyaaa-aaaaa-aaaba-cai

// The NNS Ledger canister now comes with an ICRC1 Interface which
// makes interacting with it significantly easier. This interface identifies
// accounts by the `Account` type defined below. It is a record of the
// principal and an optional subaccount.

// The other, traditional interface identifies accounts by a 32 byte array,
// defined by the `to` field in the `TransferArgs` type.
// The legacy interface has been omitted from this file.
// It is generated deterministically by a principal and a nonce (the subaccount)
// such that:
//   -- let h = sha224("\x0Aaccount-id" || principal || subaccount)
//   -- let accountIdentifier = CRC32(h) || h
// Reference:
//   https://github.com/dfinity/examples/tree/master/motoko/ledger-transfer

// The default account is generated with a subaccount=null.

// This interface file was almost completely generated from the motoko option
// on the Ledger Canister entry on Canlista:
// https://k7gat-daaaa-aaaae-qaahq-cai.ic0.app/listing/nns-ledger-10244/ryjl3-tyaaa-aaaaa-aaaba-cai



module {

    // 
    // ICRC1 Types
    public type Account = { owner : Principal; subaccount : ?[Nat8] };
    public type MetadataValue = {
        #Int : Int;
        #Nat : Nat;
        #Blob : [Nat8];
        #Text : Text;
    };
    public type StandardRecord = { url : Text; name : Text };
    public type TransferArg = {
        to : Account;
        fee : ?Nat;
        memo : ?[Nat8];
        from_subaccount : ?[Nat8];
        created_at_time : ?Nat64;
        amount : Nat;
    };
    public type Result = { #Ok : Nat; #Err : TransferError };
    public type TransferError = {
        #GenericError : { message : Text; error_code : Nat };
        #TemporarilyUnavailable;
        #BadBurn : { min_burn_amount : Nat };
        #Duplicate : { duplicate_of : Nat };
        #BadFee : { expected_fee : Nat };
        #CreatedInFuture : { ledger_time : Nat64 };
        #TooOld;
        #InsufficientFunds : { balance : Nat };
    };

    // ICRC1 Interface
    public type ICRC1Interface = actor {
        icrc1_balance_of : shared query Account -> async Nat;
        icrc1_decimals : shared query () -> async Nat8;
        icrc1_fee : shared query () -> async Nat;
        icrc1_metadata : shared query () -> async [(Text, MetadataValue)];
        icrc1_minting_account : shared query () -> async ?Account;
        icrc1_name : shared query () -> async Text;
        icrc1_supported_standards : shared query () -> async [StandardRecord];
        icrc1_symbol : shared query () -> async Text;
        icrc1_total_supply : shared query () -> async Nat;
        icrc1_transfer : shared TransferArg -> async Result; 
    };
    
};

