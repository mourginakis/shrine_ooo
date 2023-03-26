import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
import path from "path";
import fs from "fs";

// This repo sets up the enviroment properly so that all the
// imports from `src/declarations` work properly.
// big help from
// https://github.com/letmejustputthishere/svelte-vite-ts-tailwind-postcss-dfx


const isDev = process.env["DFX_NETWORK"] !== "ic";

type Network = "ic" | "local";

interface CanisterIds {
  [key: string]: { [key in Network]: string };
}


let canisterIds: CanisterIds = {};
try {
  canisterIds = JSON.parse(
    fs
      .readFileSync(
        isDev ? ".dfx/local/canister_ids.json" : "./canister_ids.json",
      )
      .toString(),
  );
} catch (e) {
  console.error("\nBefore starting the dev server run: dfx deploy\n\n");
}

// Dynamically reads dfx.json
const dfxJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../dfx.json")).toString(),
);


// Generate canister ids, required by the generated 
// canister code in src/declarations/shrine_backend
// This strange way of JSON.stringifying the value is required by vite
const canisterDefinitions = Object.entries(canisterIds).reduce(
  (acc, [key, val]) => ({
    ...acc,
    [`process.env.${key.toUpperCase()}_CANISTER_ID`]: isDev
      ? JSON.stringify(val.local)
      : JSON.stringify(val.ic),
  }),
  {},
);



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
    ...canisterDefinitions,
    "process.env.NODE_ENV": JSON.stringify(
      isDev ? "development" : "production",
    ),
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
