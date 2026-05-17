use tauri::{
    AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem,
};

const TRAY_ID: &str = "main";

pub fn create_tray() -> SystemTray {
    let toggle = CustomMenuItem::new("toggle", "显示/隐藏");
    let quit = CustomMenuItem::new("quit", "退出");

    let menu = SystemTrayMenu::new()
        .add_item(toggle)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);

    SystemTray::new()
        .with_id(TRAY_ID)
        .with_tooltip("PawFocus-学习伙伴")
        .with_menu(menu)
}

pub fn handle_tray_event(app: &AppHandle, event: SystemTrayEvent) {
    match event {
        SystemTrayEvent::LeftClick { .. } => {
            toggle_window(app);
        }
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            "toggle" => toggle_window(app),
            "quit" => app.exit(0),
            _ => {}
        },
        _ => {}
    }
}

fn toggle_window(app: &AppHandle) {
    if let Some(window) = app.get_window("main") {
        if window.is_visible().unwrap_or(false) {
            let _ = window.hide();
            // Show mini timer when main is hidden
            if let Some(mini) = app.get_window("mini-timer") {
                let _ = mini.center();
                let _ = mini.show();
                let _ = mini.set_focus();
            }
        } else {
            let _ = window.show();
            let _ = window.set_focus();
            // Hide mini timer when main is shown
            if let Some(mini) = app.get_window("mini-timer") {
                let _ = mini.hide();
            }
        }
    }
}

#[tauri::command]
pub fn update_tray_tooltip(app: AppHandle, tooltip: String) {
    if let Some(tray) = app.tray_handle_by_id(TRAY_ID) {
        let _ = tray.set_tooltip(&tooltip);
    }
}
