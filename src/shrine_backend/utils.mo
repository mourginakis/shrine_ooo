import Principal "mo:base/Principal";
import Blob      "mo:base/Blob";
import SHA256    "mo:sha256/SHA256";


module {

    // The NNS Ledger icrc1 interface specifies the Account type as a record
    // of a Principal and a 32 byte array representing a subaccount:
    //   -- type Account = { owner : Principal; subaccount : ?[Nat8] };

    // A principal is a variable length byte array up to 29 bytes.
    // The last byte is used to indicate the type:
    // <https://wiki.internetcomputer.org/wiki/Principal>

    // Thus, we can deterministically generate a unique `Account` for each
    // new user who logs into this canister, allowing each new user's funds 
    // to be kept in isolation. For example:
    // let account = {
    //     owner = thisCanisterPrincipal;
    //     subaccount = sha256(newUserPrincipal);
    // };
    // The output of a SHA256 hash is always 32 bytes.

    public type Subaccount = [Nat8];

    public func principalToSubaccount(principal: Principal): Subaccount {
        // TODO: Check to make sure the principal is a user principal,
        // or at least that it isn't the anonymous principal.
        //   -- Principal.isAnonymous(principal)
        let b = Principal.toBlob(principal);
        let hash = h(b);
        Blob.toArray(hash);
    };
    
    public func h(b : Blob) : Blob {
        Blob.fromArray(SHA256.sha256(Blob.toArray(b)));
    };

};

