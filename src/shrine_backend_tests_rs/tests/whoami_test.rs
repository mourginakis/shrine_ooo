use ic_agent::{
    Agent,
    identity::{
        AnonymousIdentity, 
        // Secp256k1Identity, 
        // BasicIdentity
    },
    agent::http_transport::ReqwestHttpReplicaV2Transport,
    export::Principal,
};
use candid::{Encode, Decode};

// Rust is too complex for this to be time-efficient.
// This is cool, but I'm going to do this in typescript instead

#[tokio::test]
async fn test_whoami() {
    let canister_id = Principal::from_text("xckzv-saaaa-aaaag-qbz6q-cai").unwrap();

    let agent: Agent = Agent::builder()
        .with_transport(ReqwestHttpReplicaV2Transport::create("https://ic0.app").unwrap())
        .with_identity(AnonymousIdentity)
        .build().unwrap();

    let mut builder = agent.update(&canister_id, "whoami");
    let result = builder
        .with_effective_canister_id(canister_id) // you don't need this here
        .with_arg(&Encode!().unwrap())
        .call_and_wait().await;
    let whoami_result= result.unwrap();
    let whoami_principal = Decode!(&whoami_result, Principal).unwrap();
    let whoami_string = Principal::to_text(&whoami_principal);
    assert!(whoami_string == "2vxsx-fae");
}


