import React, { useState } from 'react';
import { Actor, HttpAgent, ActorSubclass } from '@dfinity/agent';
import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
import { Principal } from "@dfinity/principal";


import { shrine_backend, shrine_backend_authed } from './auth';

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

