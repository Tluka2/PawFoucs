import { appWindow, LogicalPosition } from '@tauri-apps/api/window'
import { exit } from '@tauri-apps/api/process'
import { invoke } from '@tauri-apps/api/tauri'

declare global {
  interface Window {
    __TAURI__: { convertFileSrc: (src: string, protocol: string) => string }
  }
}

const isTauri = (): boolean => !!window.__TAURI__

export async function applyOpacity(_value: number): Promise<void> {
  // Tauri v1 does not support setOpacity API; opacity is handled via CSS
}

export async function applyAlwaysOnTop(flag: boolean): Promise<void> {
  if (!isTauri()) return
  await appWindow.setAlwaysOnTop(flag)
}

export async function startDrag(): Promise<void> {
  if (!isTauri()) return
  await appWindow.startDragging()
}

export async function getWindowPosition(): Promise<{ x: number; y: number } | null> {
  if (!isTauri()) return null
  const pos = await appWindow.outerPosition()
  return { x: pos.x, y: pos.y }
}

export async function setWindowPosition(x: number, y: number): Promise<void> {
  if (!isTauri()) return
  await appWindow.setPosition(new LogicalPosition(x, y))
}

export async function closeWindow(): Promise<void> {
  if (!isTauri()) return
  await exit(0)
}

export async function minimizeWindow(): Promise<void> {
  if (!isTauri()) return
  await appWindow.minimize()
}

export async function hideToTray(): Promise<void> {
  if (!isTauri()) return
  await appWindow.hide()
}

export async function showFromTray(): Promise<void> {
  if (!isTauri()) return
  await appWindow.show()
  await appWindow.setFocus()
}

export async function updateTrayTooltip(tooltip: string): Promise<void> {
  if (!isTauri()) return
  await invoke('update_tray_tooltip', { tooltip })
}

export async function showMiniTimer(): Promise<void> {
  if (!isTauri()) return
  await invoke('show_mini_timer')
}

export async function hideMiniTimer(): Promise<void> {
  if (!isTauri()) return
  await invoke('hide_mini_timer')
}

export async function broadcastTimerState(time: string, state: string, label: string, period?: string, petType?: string): Promise<void> {
  if (!isTauri()) return
  await invoke('broadcast_timer_state', { time, state, label, period, petType })
}
