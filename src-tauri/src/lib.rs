use std::fs;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[tauri::command]
fn read_dir(path: &str) -> Vec<String> {
    match fs::read_dir(path) {
        Ok(entries) => entries.filter_map(|entry| {
            entry.ok().and_then(|e| {
                e.path().file_name().and_then(|name| name.to_str().map(|s| s.to_owned()))
            })
        }).collect(),
        Err(_) => vec![],
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())

        .invoke_handler(tauri::generate_handler![read_dir])

        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
