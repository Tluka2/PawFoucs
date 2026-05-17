use tauri::{AppHandle, Manager};
use serde_json::json;

const MINI_LABEL: &str = "mini-timer";

#[tauri::command]
pub fn show_mini_timer(app: AppHandle) {
    if let Some(win) = app.get_window(MINI_LABEL) {
        let _ = win.set_always_on_top(true);
        let _ = win.center();
        let _ = win.show();
        let _ = win.set_focus();
    }
}

#[tauri::command]
pub fn hide_mini_timer(app: AppHandle) {
    if let Some(win) = app.get_window(MINI_LABEL) {
        let _ = win.hide();
    }
}

#[tauri::command]
pub fn broadcast_timer_state(app: AppHandle, time: String, state: String, label: String, period: Option<String>, pet_type: Option<String>) {
    let _ = app.emit_all("timer-update", json!({ "time": time, "state": state, "label": label, "period": period, "petType": pet_type }));
}
