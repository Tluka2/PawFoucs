import { ref, computed, onUnmounted } from 'vue'
import { usePetStore } from '@/stores/pet'
import { getRandomDialog } from '@/data/petDialogs'

export function usePet() {
  const petStore = usePetStore()

  const petType = computed(() => {
    const p = petStore.currentPet
    return p ? p.type : 'cat'
  })

  const petName = computed(() => petStore.currentPet?.name || '等待伙伴...')

  const petLevel = computed(() => petStore.currentPet?.level ?? 1)

  const expPercent = computed(() => {
    const p = petStore.currentPet
    return p ? Math.min(100, Math.round(p.exp / (p.level * 100) * 100)) : 0
  })

  const hasPet = computed(() => petStore.pets.length > 0)

  const showBubble = ref(false)
  const bubbleText = ref('')
  let bubbleTimer: ReturnType<typeof setTimeout> | null = null
  const recentTexts: string[] = []

  function triggerBubble(category: Parameters<typeof getRandomDialog>[1]) {
    bubbleText.value = getRandomDialog(petType.value, category, recentTexts)
    recentTexts.push(bubbleText.value)
    if (recentTexts.length > 5) recentTexts.shift()
    showBubble.value = true
    if (bubbleTimer) clearTimeout(bubbleTimer)
    bubbleTimer = setTimeout(() => { showBubble.value = false }, Math.max(3000, bubbleText.value.length * 200))
  }

  function handlePetClick() {
    const mood = petStore.currentPet?.mood
    if (mood === 'sad') {
      triggerBubble('sad')
    } else {
      triggerBubble('click')
    }
  }

  function showGreeting() {
    triggerBubble('greetings')
  }

  function showEncourage() {
    triggerBubble('encourage')
  }

  function showPomodoroComplete() {
    triggerBubble('pomodoroComplete')
  }

  function showBreakTime() {
    triggerBubble('breakTime')
  }

  function showSpeciesAction() {
    triggerBubble('speciesAction')
  }

  function showHabitReminder() {
    triggerBubble('habitReminder')
  }

  function showMemoReminder() {
    triggerBubble('memoReminder')
  }

  function showTodayTodo() {
    triggerBubble('todayTodo')
  }

  function showCustomBubble(text: string) {
    bubbleText.value = text
    showBubble.value = true
    if (bubbleTimer) clearTimeout(bubbleTimer)
    bubbleTimer = setTimeout(() => { showBubble.value = false }, Math.max(3000, text.length * 200))
  }

  onUnmounted(() => {
    if (bubbleTimer) clearTimeout(bubbleTimer)
  })

  return {
    petType, petName, petLevel, expPercent, hasPet,
    showBubble, bubbleText, handlePetClick,
    showGreeting, showEncourage, showPomodoroComplete, showBreakTime, showSpeciesAction,
    showHabitReminder, showMemoReminder, showTodayTodo, showCustomBubble,
  }
}
