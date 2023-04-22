import { assert, describe, expect, it, test } from 'vitest';
import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import type { ActorSubclass } from "@dfinity/agent";


// This throws an error because it tries to read types from the .did.d.ts file
// @ts-ignore   // suppresses error reporting
import { GetBlocksResult, _SERVICE, idlFactory } from "src/declarations/archive/archive.did.js";



const ARCHIVE_CANISTER_ID = 'qjdve-lqaaa-aaaaa-aaaeq-cai';

const archiveCanister: ActorSubclass<_SERVICE> = Actor.createActor(idlFactory, {
    agent: new HttpAgent({ host: "https://ic0.app" }),
    canisterId: Principal.fromText(ARCHIVE_CANISTER_ID),
});




// ugly workaround for typescript bug
// https://forum.dfinity.org/t/query-blocks-icp-ledger-candid/11948/15
import { execSync } from 'child_process';

// equivalent to calling: archiveCanister.get_blocks({start: start, length: length});
// Example call print to console:
// console.log(JSON.stringify(getBlocksWorkaround(90000n, 2n), null, 2));
const getBlocksWorkaround = (start: bigint, length: bigint): GetBlocksResult => {
    // needed: https://github.com/dfinity/idl2json
    // compile the binary and put it in the root of this repo (already in gitignore)
    const cmd = `dfx canister --network ic call "${ARCHIVE_CANISTER_ID}" ` +
        `get_blocks '(record {start = ${start} : nat64; length = ${length} : nat64} )' ` +
        `--candid ${process.cwd()}/src/declarations/archive/archive.did` +
        `| ${process.cwd()}/idl2json`;
    const result: Buffer = execSync(cmd);
    return JSON.parse(result.toString()) as GetBlocksResult;
};


describe("archive", () => {
    describe("get_blocks", () => {
        it("pull the 20 first blocks", async () => {
            // this is broken:
            // const result = await archiveCanister.get_blocks({start: 20n, length: 4n});
            const result = await getBlocksWorkaround(0n, 20n);
            if ('Err' in result) {
                throw new Error(result.Err as unknown as string);
            };
            expect(result.Ok.blocks.length).toEqual(20);
        });
    });
});


