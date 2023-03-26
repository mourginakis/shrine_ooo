# shrine.ooo

<https://xljsj-eiaaa-aaaag-qbz7a-cai.ic0.app>


## Local Development
#### Using Vite Hot Module Reloading
```bash
$ dfx start --background --clean
$ dfx deploy shrine_backend
$ npm run dev
$ dfx stop
```

#### Testing Prod on Local
```bash
$ npm run build
$ dfx deploy
```


## Deploying to Mainnet
```bash
# TODO: autoset dfx_network
$ export DFX_NETWORK='ic'
$ npm run build
$ dfx deploy --network ic
```

