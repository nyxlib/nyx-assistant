/*--------------------------------------------------------------------------------------------------------------------*/

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run()
{
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_fs::init())
        .run(tauri::generate_context!())
        .expect("error while running nyx-assistant")
    ;
}

/*--------------------------------------------------------------------------------------------------------------------*/
