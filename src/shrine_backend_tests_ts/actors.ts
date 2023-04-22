import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
import { Principal } from "@dfinity/principal";
import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import type { ActorSubclass } from "@dfinity/agent";



// Vitest unfortunately doesn't load the entire vite.config.ts file,
// so we have to create another agent/actor here from the declarations.
// we do have access to STATIC_CONTEXT and the process.env variables.
// Also we lose our types because we import only the JS. This isn't a good
// solution but it works for now.


// This throws an error because it tries to read types from the .did.d.ts file
// @ts-ignore   // suppresses error reporting
import { _SERVICE, idlFactory } from "../declarations/shrine_backend/shrine_backend.did.js";


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
const shrine_backend_anony: ActorSubclass<_SERVICE> = Actor.createActor(idlFactory, {
    agent: agent_anony,
    canisterId: process.env.SHRINE_BACKEND_CANISTER_ID as unknown as Principal,
});

const shrine_backend_authed: ActorSubclass<_SERVICE> = Actor.createActor(idlFactory, {
    agent: agent_authed,
    canisterId: process.env.SHRINE_BACKEND_CANISTER_ID as unknown as Principal,
});




export {
    shrine_backend_anony, 
    shrine_backend_authed
};

