# shrine.ooo

<https://shrine.ooo>

<https://xljsj-eiaaa-aaaag-qbz7a-cai.ic0.app>


## Local Development
#### Using Vite Hot Module Reloading
```bash
$ dfx start --background --clean
$ dfx deploy
$ npm run dev
$ dfx stop
```

#### Testing Prod on Local
```bash
$ dfx deploy
```


## Deploying to Mainnet
```bash
$ dfx deploy -- network ic
```

# Notes
- `dfx deploy`
  - automatically sets all the environment vars
  - automatically updates the .env file
  - automatically calls `npm run build`
  - note that `dfx deploy shrine_backend` does not update `.env`

