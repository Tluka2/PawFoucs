#[cfg(target_os = "macos")]
mod macos;

pub use tauri::PluginBuilder;

#[derive(Default)]
pub struct Builder;

impl Builder {
    pub fn new() -> Self {
        Self
    }

    pub fn build(self) -> impl tauri::Plugin<tauri::Event, tauri::State> {
        tauri::Builder::new("app")
            .setup(|app| {
                #[cfg(target_os = "macos")]
                {
                    #[cfg(target_os = "macos")]
                    macos::register_macos_permissions(app.handle())?;
                }
                Ok(())
            })
            .build()
    }
}
