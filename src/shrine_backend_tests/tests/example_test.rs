use reqwest::Error;
use chrono::{Utc};

use shrine_backend_tests::add;

#[test]
fn test_addition() {
    let result = add(2, 3);
    assert_eq!(result, 5);
}

#[tokio::test]
async fn get_example() -> Result<(), Error> {
    let resp = reqwest::get("https://httpbin.org/ip").await?;
    println!("Status: {}", resp.status());
    println!("Headers:\n{:#?}", resp.headers());

    let body = resp.text().await?;
    println!("Body:\n{}", body);

    Ok(())
}


#[test]
fn test_time() {
    let utc_time = Utc::now();
    println!("{}", utc_time);
    assert!(true);
}