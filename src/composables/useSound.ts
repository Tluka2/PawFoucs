import { useSettingsStore } from '@/stores/settings'

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

function playTone(frequency: number, startTime: number, duration: number, volume: number, type: OscillatorType = 'sine') {
  const ctx = getAudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = type
  osc.frequency.value = frequency
  gain.gain.setValueAtTime(volume, startTime)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(startTime)
  osc.stop(startTime + duration)
}

export function useSound() {
  const settings = useSettingsStore()

  function getVolume() {
    return (settings.settings.soundVolume / 100) * 0.3
  }

  function resume() {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()
  }

  // P0: 番茄钟完成 — 愉悦双音
  function playCompletionSound() {
    if (!settings.settings.soundEnabled) return
    try {
      resume()
      const vol = getVolume()
      const now = getAudioContext().currentTime
      playTone(659, now, 0.3, vol)        // E5
      playTone(784, now + 0.15, 0.4, vol) // G5
    } catch {}
  }

  // P0: 番茄钟开始 — 短促单音
  function playStartSound() {
    if (!settings.settings.soundEnabled) return
    try {
      resume()
      const vol = getVolume()
      const now = getAudioContext().currentTime
      playTone(523, now, 0.15, vol) // C5
    } catch {}
  }

  // P0: 番茄钟休息 — 柔和下行
  function playBreakSound() {
    if (!settings.settings.soundEnabled) return
    try {
      resume()
      const vol = getVolume()
      const now = getAudioContext().currentTime
      playTone(523, now, 0.2, vol)         // C5
      playTone(392, now + 0.2, 0.3, vol)   // G4
    } catch {}
  }

  // P1: 宠物点击 — 可爱短音
  function playPetClickSound() {
    if (!settings.settings.soundEnabled) return
    try {
      resume()
      const vol = getVolume()
      const now = getAudioContext().currentTime
      playTone(880, now, 0.08, vol * 0.6, 'triangle')          // A5
      playTone(1047, now + 0.08, 0.1, vol * 0.5, 'triangle')   // C6
    } catch {}
  }

  // P1: 金币获得 — 清脆叮声
  function playCoinSound() {
    if (!settings.settings.soundEnabled) return
    try {
      resume()
      const vol = getVolume()
      const now = getAudioContext().currentTime
      playTone(1319, now, 0.1, vol * 0.5, 'triangle')   // E6
      playTone(1568, now + 0.1, 0.15, vol * 0.4, 'triangle') // G6
    } catch {}
  }

  // P1: 习惯打卡 — 清脆打勾
  function playCheckInSound() {
    if (!settings.settings.soundEnabled) return
    try {
      resume()
      const vol = getVolume()
      const now = getAudioContext().currentTime
      playTone(784, now, 0.1, vol)          // G5
      playTone(988, now + 0.1, 0.15, vol)   // B5
      playTone(1175, now + 0.2, 0.2, vol)   // D6
    } catch {}
  }

  // P1: 健康提醒 — 柔和提示
  function playReminderSound() {
    if (!settings.settings.soundEnabled) return
    try {
      resume()
      const vol = getVolume()
      const now = getAudioContext().currentTime
      playTone(440, now, 0.3, vol * 0.4, 'sine')       // A4
      playTone(523, now + 0.3, 0.3, vol * 0.4, 'sine') // C5
    } catch {}
  }

  // P1: 购买成功
  function playPurchaseSound() {
    if (!settings.settings.soundEnabled) return
    try {
      resume()
      const vol = getVolume()
      const now = getAudioContext().currentTime
      playTone(523, now, 0.1, vol)          // C5
      playTone(659, now + 0.1, 0.1, vol)    // E5
      playTone(784, now + 0.2, 0.2, vol)    // G5
    } catch {}
  }

  return {
    playCompletionSound,
    playStartSound,
    playBreakSound,
    playPetClickSound,
    playCoinSound,
    playCheckInSound,
    playReminderSound,
    playPurchaseSound,
  }
}
