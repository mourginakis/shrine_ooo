import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
import { Principal } from "@dfinity/principal";
import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import { assert, describe, expect, it } from 'vitest';


// Vitest unfortunately doesn't load the entire vite.config.ts file,
// so we have to do some black magic to get the agent/actor.
// we do have access to STATIC_CONTEXT and the process.env variables.
// Also we lose our types because we import only the JS. This isn't a good
// solution but it works for now.


// This throws an error because it tries to read types from the .did.d.ts file
// @ts-ignore   // suppresses error reporting
import { idlFactory } from "../declarations/shrine_backend/shrine_backend.did.js";


const identity = Secp256k1KeyIdentity.fromParsedJson(
    STATIC_CONTEXT.testingIdentityJSON
);


const agent_anony = new HttpAgent({ host: "http://127.0.0.1:4943" });
agent_anony.fetchRootKey();

const agent_authed = new HttpAgent({ host: "http://127.0.0.1:4943", identity });
agent_authed.fetchRootKey();


// for mainnet testing:
//   -- host: "https://ic0.app",
//   -- cancel the fetchRootKey() call


// process.env.SHRINE_BACKEND_CANISTER_ID gets replaced by vite at build time
const shrine_backend_anony = Actor.createActor(idlFactory, {
    agent: agent_anony,
    canisterId: process.env.SHRINE_BACKEND_CANISTER_ID as unknown as Principal,
});

const shrine_backend_authed = Actor.createActor(idlFactory, {
    agent: agent_authed,
    canisterId: process.env.SHRINE_BACKEND_CANISTER_ID as unknown as Principal,
});





describe('whoami', () => {
    it('returns anonymous user', async () => {
      const result = await shrine_backend_anony.whoami() as unknown as Principal;
      expect(result.toString()).toEqual('2vxsx-fae');
    });
    it('returns authed user', async () => {
        const result = await shrine_backend_authed.whoami() as unknown as Principal;
        expect(result.toString()).toEqual("lsmxf-qps3b-dfjhw-njhat-2enm6-iysq5-gflw4-5c2as-i7r4s-37pfu-pae");
    });
  });