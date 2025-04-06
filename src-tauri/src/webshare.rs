use quick_xml::de::from_str;
use reqwest::Client;
use serde::Deserialize;
use std::collections::HashMap;

const BASE_URL: &str = "https://webshare.cz/api"; // Base url for webshare api

#[derive(Debug, Deserialize)]
pub struct ResponseSalt {
    status: String,
    salt: String,
}

impl ResponseSalt {
    fn from_xml(xml: &str) -> Result<Self, String> {
        from_str(xml).map_err(|e| format!("Xml parser errror {:?}", e)) // the |e| is anonymus fn (usecases in map, etc) like a lambda expression in python
    }
}

pub struct WebshareApi {
    client: Client,
    base_url: String,
}

impl WebshareApi {
    // constructor
    fn new() -> Self {
        WebshareApi {
            client: Client::new(),
            base_url: BASE_URL.to_string(),
        }
    }

    // self like in python
    pub async fn get_salt(&self, username: &str) -> Result<ResponseSalt, String> {
        let url = format!("{}/salt/", self.base_url);
        println!("[Webshare] Requesting salt for: {}", username);

        let mut form_data = HashMap::new();
        form_data.insert("username_or_email", username);

        let response = self
            .client
            .post(&url)
            .form(&form_data)
            .header("Accept", "text/xml; charset=UTF-8")
            .header(
                "Content-Type",
                "application/x-www-form-urlencoded; charset=UTF-8",
            )
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?; // ? is short format for match if no error do nothing and continue either call error string as return for fn

        let body = response
            .text()
            .await
            .map_err(|e| format!("Failed to read body: {}", e))?;

        println!("[Webshare] Raw response:\n{}", body);
        ResponseSalt::from_xml(&body)
    }
}

#[tauri::command]
pub async fn get_salt(username: String) -> Result<String, String> {
    let api = WebshareApi::new();
    let response = api.get_salt(&username).await?;
    println!("Status: {}, Salt: {}", response.status, response.salt);
    Ok(response.salt)
}
