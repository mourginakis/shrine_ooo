import React, { useState } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
import { Principal } from "@dfinity/principal";



// ----------------- BEGIN ----------------- //

// You can either import the actor from the bakcend like so (not currently working):

// console.log(process.env.SHRINE_BACKEND_CANISTER_ID);
// import { idlFactory, shrine_backend } from '../../declarations/shrine_backend';



// ----------------- OR ----------------- //


// You can create your own actor in here like so:

// @ts-expect-error
import { idlFactory } from '../../declarations/shrine_backend/shrine_backend.did.js';


// use the authed testing identity
const identity = Secp256k1KeyIdentity.fromParsedJson(
    STATIC_CONTEXT.testingIdentityJSON
);

// or use the anonymous identity, "shrine_backend"


const agent = new HttpAgent({ host: STATIC_CONTEXT.host, identity: identity});
if (STATIC_CONTEXT.network === "local") { agent.fetchRootKey() };

const shrine_backend = Actor.createActor(
    idlFactory,
    { agent, canisterId: STATIC_CONTEXT.canisterId }
);



// ----------------- END ----------------- //



interface Props {};

const ExampleWhoami: React.FC<Props> = () => {
    const [whoami, setWhoami] = useState("");

    const callWhoami = async () => {
        const result = await shrine_backend.whoami();
        let result2 = result as Principal; // this should be done automatically but the import is broken
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

