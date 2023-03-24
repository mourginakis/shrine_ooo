import React, { useState } from 'react';
import { Actor, HttpAgent, ActorSubclass } from '@dfinity/agent';
import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
import { Principal } from "@dfinity/principal";



// ----------------- BEGIN AUTH ----------------- //

// You can either import the actor from the backend like so
// not currenlty working due to the fetchRootKey() call returning a parsing error:

// console.log(process.env.SHRINE_BACKEND_CANISTER_ID);
// import { idlFactory, shrine_backend } from '../../declarations/shrine_backend';



// ----------------- OR ----------------- //


// You can create your own actor in here like so:
// for some reason, importing from ../../declarations/shrine_backend
// calls fetchRootKey, which gives a weird parse error that I think has to
// do with some globals thing.
// @ts-expect-error
import { idlFactory } from '../../declarations/shrine_backend/shrine_backend.did.js';
import { _SERVICE } from '../../declarations/shrine_backend/shrine_backend.did';


// use the authed testing identity, or set identity to null to use the anonymous identity
const identity = Secp256k1KeyIdentity.fromParsedJson(
    STATIC_CONTEXT.testingIdentityJSON
);

const agent = new HttpAgent({ host: STATIC_CONTEXT.host, identity: identity});
if (STATIC_CONTEXT.network === "local") { agent.fetchRootKey() };

const shrine_backend: ActorSubclass<_SERVICE> = Actor.createActor(
    idlFactory,
    { agent, canisterId: STATIC_CONTEXT.canisterId }
);


// ----------------- END ----------------- //




interface Props {};

const ExampleWhoami: React.FC<Props> = () => {
    const [whoami, setWhoami] = useState("");

    const callWhoami = async () => {
        const result = await shrine_backend.whoami();
        let result2 = result;
        setWhoami(result2.toString());
    };

    return (
        <div className="flex flex-col items-center justify-center my-14">
            <h1 className="text-2xl">ExampleWhoami</h1>
            <div className="flex space-x-2">
                <button
                    className="px-4 py-2 text-white bg-blue-500 rounded"
                    onClick={callWhoami}
                >
                    Whoami
                </button>
            </div>
            <div className="bg-gray-100 w-96 h-16 rounded-lg mt-4 flex items-center justify-center">
                <p>{whoami || "Call 'Whoami' to see your identity"}</p>
            </div>
        </div>
    );
};

export default ExampleWhoami;

