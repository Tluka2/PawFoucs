/**
 * Window Configuration Types
 * Desktop window settings
 */

export interface WindowSettings {
  width: number            // default 320
  height: number           // default 480
  minWidth: number         // 320
  minHeight: number        // 480
  opacity: number          // 10-100
  alwaysOnTop: boolean
  showDecorations: boolean
  lockPosition: boolean
  position?: {
    x: number
    y: number
  }
  autoStart: boolean
  closeAction?: 'trayWithTimer' | 'trayOnly' | 'exit' // deprecated
}