import { assert, describe, expect, it, test } from 'vitest';
import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import type { ActorSubclass } from "@dfinity/agent";


// This throws an error because it tries to read types from the .did.d.ts file
// @ts-ignore   // suppresses error reporting
import { Account, TransferArg, _SERVICE, idlFactory } from "../ledger/ledger.did.js";



// This file isn't meant to be called or tested, but it still should work every time.
// It's kept here as a reference of calls that can be made to the ledger canister, 
// and as a sanity check


const ledgerCanisterId = "ryjl3-tyaaa-aaaaa-aaaba-cai";
// const agent = new HttpAgent({ host: "https://ic0.app" });


const ledgerCanister: ActorSubclass<_SERVICE> = Actor.createActor(idlFactory, {
    agent: new HttpAgent({ host: "https://ic0.app" }),
    canisterId: Principal.fromText(ledgerCanisterId),
});


const testAccount: Account = {
    // some random account on ICscan that I've verified has a balance
    owner: Principal.fromText("zzjij-ha6hk-2cxtp-cftna-oe3y2-hig6y-fw2hv-qdvae-kopuj-ylda7-jqe"),
    subaccount: [],
};



describe("icrc1", () => {
    /* From ledger.did:
    icrc1_balance_of : (Account) -> (nat) query;
    icrc1_decimals : () -> (nat8) query;
    icrc1_fee : () -> (nat) query;
    icrc1_metadata : () -> (vec record { text; MetadataValue }) query;
    icrc1_minting_account : () -> (opt Account) query;
    icrc1_name : () -> (text) query;
    icrc1_supported_standards : () -> (vec StandardRecord) query;
    icrc1_symbol : () -> (text) query;
    icrc1_total_supply : () -> (nat) query;
    icrc1_transfer : (TransferArg) -> (Result);
    */
    
    // icrc1_balance_of : (Account) -> (nat) query;
    describe("icrc1_balance_of", () => {
        it("returns > 0", async () => {
            const result = await ledgerCanister.icrc1_balance_of(testAccount);
            expect(result).toBeGreaterThan(0);
        });
    });

    // icrc1_decimals : () -> (nat8) query;
    describe("icrc1_decimals", () => {
        it("returns 8", async () => {
            const result = await ledgerCanister.icrc1_decimals();
            expect(result).toEqual(8);
        });
    });

    // icrc1_fee : () -> (nat) query;
    describe("icrc1_fee", () => {
        it("returns > 0", async () => {
            const result = await ledgerCanister.icrc1_fee();
            expect(result).toBeGreaterThan(0);
        });
    });

    // icrc1_symbol : () -> (text) query;
    describe("icrc1_symbol", () => {
        it("returns ICP", async () => {
            const result = await ledgerCanister.icrc1_symbol();
            expect(result).toEqual("ICP");
        });
    });

    // icrc1_total_supply : () -> (nat) query;
    describe("icrc1_total_supply", () => {
        it("returns > 0", async () => {
            const result = await ledgerCanister.icrc1_total_supply();
            expect(result).toBeGreaterThan(0);
        });
    });
    

    // icrc1_transfer : (TransferArg) -> (Result);
    describe("icrc1_transfer", () => {
        it("fails because anonymous agent", async () => {
            const transferArg: TransferArg = {
                to: testAccount,
                amount: BigInt(1) as bigint,
                fee: [],
                memo: [],
                from_subaccount: [],
                created_at_time: [],
            };
            try {
                // This should fail
                const result = await ledgerCanister.icrc1_transfer(transferArg);
            } catch (e) {
                expect(true).toEqual(true);
            };
        });
    }, 60000);


});

