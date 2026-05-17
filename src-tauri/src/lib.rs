mod tray;
mod mini_timer;

use tauri::Manager;

pub fn run() {
    tauri::Builder::default()
        .system_tray(tray::create_tray())
        .on_system_tray_event(tray::handle_tray_event)
        .invoke_handler(tauri::generate_handler![
            tray::update_tray_tooltip,
            mini_timer::show_mini_timer,
            mini_timer::hide_mini_timer,
            mini_timer::broadcast_timer_state,
        ])
        .setup(|app| {
            #[cfg(desktop)]
            {
                if let Some(window) = app.get_window("main") {
                    // Normalize WebView2 zoom to prevent DPI-induced layout differences
                    #[cfg(target_os = "windows")]
                    {
                        let _ = window.eval("document.documentElement.style.zoom = '1'");
                    }
                    window.show()?;
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
