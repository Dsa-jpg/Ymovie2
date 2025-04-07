use quick_xml::de::from_str;
use reqwest::Client;
use serde::Deserialize;
use std::collections::HashMap;
use std::process::{Command, Stdio};
use std::str;
use std::env;

const BASE_URL: &str = "https://webshare.cz/api"; // Base url for webshare api

#[derive(Debug, Deserialize)]
pub struct ResponseSalt {
    status: String,
    salt: String,
}

#[derive(Debug, Deserialize)]
pub struct ResponseLogin {
    status: String,
    token: String,

}

impl ResponseSalt {
    fn from_xml(xml: &str) -> Result<Self, String> {
        from_str(xml).map_err(|e| format!("Xml parser errror {:?}", e)) // the |e| is anonymus fn (usecases in map, etc) like a lambda expression in python
    }
}

impl ResponseLogin {
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


    pub async fn login(&self, username: &str, password: &str, salt: &str) -> Result<ResponseLogin, String> {
        let url = format!("{}/login/", self.base_url);
        println!("[Webshare] Requesting login for: {}", username);

        let mut form_data = HashMap::new();
        form_data.insert("username_or_email", username);

        // Hashování hesla
        let hashed_password = run_python_script(password, salt)?;
        form_data.insert("password", &hashed_password);

        let response = self
            .client
            .post(&url)
            .form(&form_data)
            .header("Accept", "text/xml; charset=UTF-8")
            .header("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        let body = response
            .text()
            .await
            .map_err(|e| format!("Failed to read body: {}", e))?;

        println!("[Webshare] Raw response:\n{}", body);
        // Zde můžeš přizpůsobit podle struktury odpovědi, kterou vrátí API
        ResponseLogin::from_xml(&body) 
    }

}

#[tauri::command]
pub async fn get_salt(username: String) -> Result<String, String> {
    let api = WebshareApi::new();
    let response = api.get_salt(&username).await?;
    println!("Status: {}, Salt: {}", response.status, response.salt);
    Ok(response.salt)
}

#[tauri::command]
pub async fn login(username: String, password: String) -> Result<String, String> {
    let api = WebshareApi::new();
    let salt_response = api.get_salt(&username).await?;
    let salt = salt_response.salt;
    let login_response = api.login(&username, &password, &salt).await?;
    println!("Status: {}, Token: {}", login_response.status, login_response.token);
    Ok(login_response.token)
}




fn run_python_script(password: &str, salt: &str) -> Result<String, String> {
    // Získáme cestu k aktuálnímu adresáři aplikace
    let exe_path = env::current_exe()
        .map_err(|e| format!("Chyba při získávání cesty k aplikaci: {}", e))?
        .parent() // Získání rodičovského adresáře
        .ok_or("Nelze získat rodičovský adresář")? // Pokud není rodičovský adresář, vrátíme chybu
        .join("resources/md5_crypt_hashe.exe"); // Spojíme cestu s relativní cestou k exe souboru

    let output = Command::new(exe_path)  // Cesta k .exe souboru
        .arg(password)                   // Předáme heslo
        .arg(salt)                       // Předáme sůl
        .stdout(Stdio::piped())           // Přejeme si získat výstup
        .stderr(Stdio::piped())           // Přejeme si získat chyby, pokud nějaké nastanou
        .output()
        .map_err(|e| format!("Chyba při spuštění .exe souboru: {}", e))?;

    if !output.status.success() {
        return Err(format!(
            "Spuštění .exe souboru selhalo: {}\nStderr: {}",
            String::from_utf8_lossy(&output.stdout),
            String::from_utf8_lossy(&output.stderr)
        ));
    }

    // Získáme výstup z .exe souboru
    let result = String::from_utf8_lossy(&output.stdout).to_string();

    // Vrátíme hodnotu (např. hash)
    Ok(result.trim().to_string())  // Trim odstraní případné nové řádky na konci
}