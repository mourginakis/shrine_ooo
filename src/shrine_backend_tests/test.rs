#!/usr/bin/env rust-script
//! This is a regular crate doc comment, but it also contains a partial
//! Cargo manifest.  Note the use of a *fenced* code block, and the
//! `cargo` "language".
//!
//! ```cargo
//! [dependencies]
//! time = "0.1.25"
//! serde = "1.0.159"
//! reqwest = {version = "0.11", features = ["json"]}
//! tokio = { version = "1.12.0", features = ["full"] }
//! ```

use reqwest::Error;


async fn get_example() -> Result<(), Error> {
    let resp = reqwest::get("https://httpbin.org/ip").await?;
    println!("Status: {}", resp.status());
    println!("Headers:\n{:#?}", resp.headers());

    let body = resp.text().await?;
    println!("Body:\n{}", body);

    Ok(())
}

#[tokio::main]
async fn main() {
    println!("{}", time::now().rfc822z());

    match get_example().await {
        Ok(_) => println!("Success"),
        Err(e) => eprintln!("Error: {}", e),
    }
}