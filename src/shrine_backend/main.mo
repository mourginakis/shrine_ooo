import Prelude   "mo:base/Prelude";
import HashMap   "mo:base/HashMap";
import Result    "mo:base/Result";
import Buffer    "mo:base/Buffer";
import Text      "mo:base/Text";
import Principal "mo:base/Principal";
import Array     "mo:base/Array";
import Time      "mo:base/Time";

import Trove "trove";

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
    // ICP Transfer
    type Subaccount = Blob;
    type Account = { 
        owner : Principal;
        subaccount : ?Subaccount;
    };

    let ledgerCanister : actor { icrc1_balance_of : (Account) -> async Nat } = actor ("ryjl3-tyaaa-aaaaa-aaaba-cai");

    public shared func getThisCanisterPrincipal() : async Principal {
        Principal.fromActor(Self)
    };
    public shared func getThisCanisterAccount() : async () {
        Prelude.nyi()
    };

    // This function is an example to show how to get the balance of another principal
    public shared func getForeignCanisterBalance(principalId : Text): async Nat{
        let owner = Principal.fromText(principalId);
        await ledgerCanister.icrc1_balance_of({owner; subaccount = null;})
    };

    public shared func getThisCanisterBalance() : async Nat {
        Prelude.nyi();
    };







    //
    // misc & system funcs
    public shared ({caller}) func whoami() : async Principal {caller};

};
