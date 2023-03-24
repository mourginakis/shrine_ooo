import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";


// TODO: dynamically load 'canisterId' from filesystem
const context = (() => {
  switch(process.env.DFX_NETWORK) {
    case "local":
      return {
        network: "local",
        host: "http://127.0.0.1:4943",
        canisterId: "rrkah-fqaaa-aaaaa-aaaaq-cai"
      }
    case "ic":
      return {
        network: "ic",
        host: "https://ic0.app",
        canisterId: "xckzv-saaaa-aaaag-qbz6q-cai"
      }
    
    default: throw new Error("DFX_NETWORK not set")
  }
})();



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
    outDir: '../../dist/shrine_frontend'
  },
  define: {
    STATIC_CONTEXT: {
      network: context.network,
      host: context.host,
      canisterId: context.canisterId,
      testingIdentityJSON,
    },
    'process.env.SHRINE_BACKEND_CANISTER_ID': JSON.stringify(context.canisterId),
  },
  optimizeDeps: {
    esbuildOptions: {
      // this redefine is needed for:
      // - agent.fetchRootKey();
      // - Secp256k1KeyIdentity library in browser
      define: {
        global: 'globalThis',
      }
    }
  }
})
