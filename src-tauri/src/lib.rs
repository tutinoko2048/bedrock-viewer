use serde::{Deserialize, Serialize};
use mojang_leveldb::{Options, ReadOptions, DB};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[derive(Debug, Serialize, Deserialize)]
pub struct LoadWorldResult {
    pub keys: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct World {
    pub keys: Vec<String>,
}

impl World {
    pub fn new(keys: Vec<String>) -> Self {
        World { keys }
    }
}

#[tauri::command]
fn load_world(path: &str) -> World {
    let name: &str = &format!("{}/db", path);
    let db = DB::open(
        name,
        Options {
            create_if_missing: false,
            compression: mojang_leveldb::CompressionType::ZlibRaw,
        }
    ).unwrap();

    let keys: Vec<String> = db.iter(ReadOptions { fill_cache: false, verify_checksums: false })
        .map(|(key, _value)| {
            let str_key_result = std::str::from_utf8(key.get());
            if str_key_result.is_err() { return String::new(); }

            let str_key = str_key_result.unwrap().trim();

            // if includes \0 continue 
            if str_key.contains("\0") { return String::new(); }
            if str_key.starts_with("player_") { return String::new(); }

            str_key.to_string()
        })
        .filter(|key| key.len() > 0)
        .collect();

    World::new(keys)
}

// #[tauri::command]
// pub fn get_data(key: &str) -> String {

// }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())

        .invoke_handler(tauri::generate_handler![load_world])

        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
