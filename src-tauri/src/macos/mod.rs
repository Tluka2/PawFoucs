use cocoa::appkit::{NSApp, NSApplicationActivationPolicy};
use tauri::{AppHandle, GlobalShortcutManager, Manager};

pub fn register_macos_permissions(_app: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    unsafe {
        let app = NSApp::sharedApplication();
        app.setActivationPolicy(NSApplicationActivationPolicy::Regular);
    }
    Ok(())
}
