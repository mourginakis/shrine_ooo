import Prelude   "mo:base/Prelude";
import HashMap   "mo:base/HashMap";
import Result    "mo:base/Result";
import Buffer    "mo:base/Buffer";
import Text      "mo:base/Text";
import Principal "mo:base/Principal";
import Array     "mo:base/Array";
import Time      "mo:base/Time";
import Option    "mo:base/Option";

import Trove "trove";
import NNSLedger "nnsledger";

actor Self {

    //
    // State Management
    // TODO: Indexing by tags, title, accounts.
    let balances = HashMap.HashMap<Principal, Nat>(200, Principal.equal, Principal.hash);
    let troves   = Buffer.Buffer<Trove.Trove>(300);

    //
    // Create Trove
    public shared ({ caller }) func createTrove(
        title: Text, description : Text, tags : [Text]
    ) : async Result.Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {return #err("Error: You must be logged in to create a trove.")};
        let timeNanoseconds = Time.now();
        let newTrove = Trove.Trove(title, description, tags, timeNanoseconds);
        troves.add(newTrove);
        return #ok("Trove successfully created.");
    };

    //
    // Revalue Trove
    public shared ({ caller }) func revalueTrove() : async Result.Result<Text, Text> {
        return #err("Not Yet Implemented");
    };

    //
    // Dissolve Trove
    public shared ({ caller }) func dissolveTrove() : async Result.Result<Text, Text> {
        let hasValue = false;
        if (hasValue) {return #err("Trove must be valueless before any party can dissolve it")};
        return #err("Not Yet Implemented")
    };

    //
    // List Troves
    public query func listTroves() : async [Text] {
        let titles : Buffer.Buffer<Text> = Buffer.map(
            troves,
            Trove.getTitle
        );
        return Buffer.toArray(titles);
    };




    //
    // ICP Transfer - ICRC1 Interface
    //   --  let thisCanisterPrincipal = Principal.fromActor(Self);
    let ledgerCanister : NNSLedger.ICRC1Interface = actor("ryjl3-tyaaa-aaaaa-aaaba-cai");

    public func getThisCanisterBalance() : async Nat {
        // Each ICP token is divisible 10^8 times.
        // The return value here is measured in 10^-8 of an ICP token.
        let selfPrincipal = Principal.fromActor(Self);
        let selfDefaultAccount: NNSLedger.Account = {owner = selfPrincipal; subaccount = null};
        await ledgerCanister.icrc1_balance_of(selfDefaultAccount)
    };

    public func getTargetCanisterBalance(targetPrincipal: Principal, subaccount: ?[Nat8]) : async Nat {
        let targetAccount: NNSLedger.Account = {owner = targetPrincipal; subaccount};
        await ledgerCanister.icrc1_balance_of(targetAccount);
    };

    public func transferTokensToPrincipal(targetPrincipal: Principal, amt: Nat) : async NNSLedger.Result {
        let targetDefaultAccount: NNSLedger.Account = {owner = targetPrincipal; subaccount = null};
        let transferArg: NNSLedger.TransferArg = {
            to              = targetDefaultAccount;
            fee             = null;
            memo            = null;
            from_subaccount = null;
            created_at_time = null;
            amount          = amt;
        };
        let result = await ledgerCanister.icrc1_transfer(transferArg);
        result // errors will just propogate
    };



    //
    // misc & system funcs
    public shared ({caller}) func whoami() : async Principal {caller};

};
