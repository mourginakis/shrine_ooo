import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

// This repo sets up the enviroment properly so that all the
// imports from `src/declarations` work properly.
// big help from
// https://github.com/letmejustputthishere/svelte-vite-ts-tailwind-postcss-dfx


// dfx as of 0.13.0 autogenerates a .env file that makes things easier
dotenv.config({ path: path.join(__dirname, "../../.env") });

// `dfx deploy` will update the .env file with the canister ids
// `dfx deploy` will also run `vite build` which will read the .env file
// and generate the canister ids in the vite.config.ts file (this file)
// if you've ever set DFX_NETWORK manually, call `unset DFX_NETWORK`
// if for some reason DFX_NETWORK='ic' when running on local,
// you may have to call `dfx deploy` again to reset the .env file
const DFX_NETWORK = process.env["DFX_NETWORK"];
const CANISTER_ID_shrine_frontend = process.env["CANISTER_ID_shrine_frontend"];
const CANISTER_ID_shrine_backend = process.env["CANISTER_ID_shrine_backend"];
const NODE_ENV = (() => {
  switch (DFX_NETWORK) {
    case "ic": return 'production';
    case "local": return 'development';
    default: throw new Error("DFX_NETWORK must be set to either 'ic' or 'local'");
  };
})();

console.log('\n');
console.log("-- DFX_NETWORK:                ", DFX_NETWORK);
console.log("-- CANISTER_ID_shrine_frontend:", CANISTER_ID_shrine_frontend);
console.log("-- CANISTER_ID_shrine_backend: ", CANISTER_ID_shrine_backend);
console.log("-- NODE_ENV:                   ", NODE_ENV);
console.log('\n');



// this mnemonic is for deterministic testing of authenticated calls on
// the local network and will NEVER contain any monetary value.
let testingSeedPhrase =
  "couple corn reform result whisper hedgehog word paddle " +
  "lock hurt window else juice mask swing";

let testingIdentity = Secp256k1KeyIdentity.fromSeedPhrase(testingSeedPhrase);
// whoami() => 'lsmxf-qps3b-dfjhw-njhat-2enm6-iysq5-gflw4-5c2as-i7r4s-37pfu-pae'
let testingIdentityJSON = testingIdentity.toJSON();
// Secp256k1KeyIdentity.fromParsedJSON(testingIdentityJSON)



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../dist/shrine_frontend',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      // Proxies http://127.0.0.1:5173/api => http://127.0.0.1:4943/api
      "/api": {
        target: `http://127.0.0.1:4943`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
  define: {
    STATIC_CONTEXT: {
      testingIdentityJSON,
    },
    // this loads environment variables in as build time static constants
    // that the files in src/declarations 
    // you have to call JSON.stringify() on raw strings
    'process.env.CANISTER_ID_shrine_frontend': JSON.stringify(CANISTER_ID_shrine_frontend),
    'process.env.CANISTER_ID_shrine_backend': JSON.stringify(CANISTER_ID_shrine_backend),
    'process.env.SHRINE_BACKEND_CANISTER_ID': JSON.stringify(CANISTER_ID_shrine_backend),
    'process.env.SHRINE_FRONTEND_CANISTER_ID': JSON.stringify(CANISTER_ID_shrine_frontend),
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  },
  optimizeDeps: {
    esbuildOptions: {
      // this redefine is needed for:
      // - agent.fetchRootKey();
      // - Secp256k1KeyIdentity library in browser
      // - libraries used when importing from src/declarations
      define: {
        global: 'globalThis',
      }
    }
  }
})
