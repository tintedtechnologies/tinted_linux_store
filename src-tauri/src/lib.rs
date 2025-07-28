use serde::{Deserialize, Serialize};

/**
 * Strip HTML tags from a string and clean up whitespace
 */
fn strip_html_tags(input: &str) -> String {
    let mut result = String::new();
    let mut inside_tag = false;
    let mut chars = input.chars().peekable();
    
    while let Some(ch) = chars.next() {
        match ch {
            '<' => inside_tag = true,
            '>' => inside_tag = false,
            _ if !inside_tag => result.push(ch),
            _ => {} // Skip characters inside tags
        }
    }
    
    // Clean up multiple whitespaces and newlines
    result
        .split_whitespace()
        .collect::<Vec<&str>>()
        .join(" ")
        .trim()
        .to_string()
}

#[derive(Serialize, Deserialize, Debug)]
struct FlathubApp {
    #[serde(rename = "flatpakAppId")]
    flatpak_app_id: String,
    name: String,
    summary: String,
    #[serde(rename = "iconDesktopUrl")]
    icon_desktop_url: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct FlathubAppDetails {
    #[serde(rename = "flatpakAppId")]
    flatpak_app_id: String,
    name: String,
    summary: String,
    description: Option<String>,
    #[serde(rename = "iconDesktopUrl")]
    icon_desktop_url: String,
    #[serde(rename = "currentReleaseVersion")]
    current_release_version: Option<String>,
    #[serde(rename = "currentReleaseDate")]
    current_release_date: Option<String>,
    #[serde(rename = "developerName")]
    developer_name: Option<String>,
    #[serde(rename = "projectLicense")]
    project_license: Option<String>,
    categories: Option<Vec<FlathubCategory>>,
    screenshots: Option<Vec<FlathubScreenshot>>,
}

#[derive(Serialize, Deserialize, Debug)]
struct FlathubCategory {
    name: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct FlathubScreenshot {
    #[serde(rename = "imgDesktopUrl")]
    img_desktop_url: Option<String>,
    #[serde(rename = "imgMobileUrl")]
    img_mobile_url: Option<String>,
    #[serde(rename = "thumbUrl")]
    thumb_url: Option<String>,
}

#[derive(Serialize)]
struct AppResult {
    id: String,
    name: String,
    summary: String,
    #[serde(rename = "iconUrl")]
    icon_url: String,
}

#[derive(Serialize)]
struct AppDetailsResult {
    id: String,
    name: String,
    summary: String,
    description: String,
    #[serde(rename = "iconUrl")]
    icon_url: String,
    version: String,
    developer: String,
    license: String,
    category: String,
    #[serde(rename = "updatedDate")]
    updated_date: String,
    screenshots: Vec<String>,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn search_apps(query: String) -> Result<Vec<AppResult>, String> {
    let url = format!("https://flathub.org/api/v1/apps/search/{}", urlencoding::encode(&query));
    
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(30))
        .build()
        .map_err(|e| format!("Failed to create HTTP client: {}", e))?;
    
    let response = client
        .get(&url)
        .header("User-Agent", "Tinted-Linux-Store/1.0")
        .send()
        .await
        .map_err(|e| {
            if e.is_timeout() {
                "Request timeout: The search took too long to complete".to_string()
            } else if e.is_connect() {
                "Network error: Unable to connect to Flathub".to_string()
            } else {
                format!("Request failed: {}", e)
            }
        })?;
    
    if !response.status().is_success() {
        return Err(format!("Server error: HTTP {}", response.status()));
    }
    
    let apps: Vec<FlathubApp> = response
        .json()
        .await
        .map_err(|e| format!("JSON parsing error: Failed to parse server response - {}", e))?;
    
    let results: Vec<AppResult> = apps
        .into_iter()
        .map(|app| AppResult {
            id: app.flatpak_app_id,
            name: app.name,
            summary: app.summary,
            icon_url: app.icon_desktop_url,
        })
        .collect();
    
    Ok(results)
}

#[tauri::command]
async fn get_app_details(app_id: String) -> Result<AppDetailsResult, String> {
    let url = format!("https://flathub.org/api/v1/apps/{}", urlencoding::encode(&app_id));
    
    println!("Fetching app details: {}", url);
    
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(30))
        .build()
        .map_err(|e| format!("Failed to create HTTP client: {}", e))?;
    
    let response = client
        .get(&url)
        .header("User-Agent", "Tinted-Linux-Store/1.0")
        .send()
        .await
        .map_err(|e| {
            if e.is_timeout() {
                "Request timeout: The request took too long to complete".to_string()
            } else if e.is_connect() {
                "Network error: Unable to connect to Flathub".to_string()
            } else {
                format!("Request failed: {}", e)
            }
        })?;
    
    if !response.status().is_success() {
        return Err(format!("Server error: HTTP {}", response.status()));
    }
    
    let app_details: FlathubAppDetails = response
        .json()
        .await
        .map_err(|e| format!("JSON parsing error: Failed to parse server response - {}", e))?;
    
    println!("Fetched details for: {}", app_details.name);
    
    // Extract screenshots
    let screenshots = app_details.screenshots
        .unwrap_or_default()
        .into_iter()
        .filter_map(|screenshot| screenshot.img_desktop_url)
        .collect();
    
    // Build the result
    let result = AppDetailsResult {
        id: app_details.flatpak_app_id.clone(),
        name: app_details.name,
        summary: app_details.summary,
        description: app_details.description
            .map(|desc| strip_html_tags(&desc))
            .unwrap_or_else(|| "No description available.".to_string()),
        icon_url: app_details.icon_desktop_url,
        version: app_details.current_release_version.unwrap_or_else(|| "Unknown".to_string()),
        developer: app_details.developer_name.unwrap_or_else(|| "Unknown Developer".to_string()),
        license: app_details.project_license.unwrap_or_else(|| "Unknown".to_string()),
        category: app_details.categories
            .and_then(|cats| cats.first().map(|cat| cat.name.clone()))
            .unwrap_or_else(|| "Other".to_string()),
        updated_date: app_details.current_release_date.unwrap_or_else(|| "Unknown".to_string()),
        screenshots,
    };
    
    Ok(result)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, search_apps, get_app_details])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
