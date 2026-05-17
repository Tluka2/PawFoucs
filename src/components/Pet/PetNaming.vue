<template>
  <div class="pet-naming">
    <PetSprite :pet-type="petType" size="sm" />
    <div class="naming-label">给你的伙伴取个名字吧</div>
    <input
      ref="nameInput"
      v-model="inputName"
      class="naming-input"
      placeholder="1-10个字符"
      maxlength="10"
      @keyup.enter="submitName"
    />
    <div v-if="errorMsg" class="naming-error">{{ errorMsg }}</div>
    <div class="naming-actions">
      <button class="name-btn back" @click="$emit('back')">返回</button>
      <button class="name-btn confirm" :disabled="!isValid" @click="submitName">确认</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { PetType } from '@/types/pet'
import { usePetStore } from '@/stores/pet'
import PetSprite from './PetSprite.vue'

defineProps<{ petType: PetType }>()
const emit = defineEmits<{ confirm: [name: string]; back: [] }>()

const petStore = usePetStore()

const inputName = ref('')
const errorMsg = ref('')
const nameInput = ref<HTMLInputElement | null>(null)

onMounted(() => nameInput.value?.focus())

const isValid = computed(() => {
  const t = inputName.value.trim()
  return t.length >= 1 && t.length <= 10
})

function submitName() {
  try {
    const valid = petStore.validatePetName(inputName.value)
    errorMsg.value = ''
    emit('confirm', valid)
  } catch {
    errorMsg.value = '名字需要1-10个字符'
  }
}
</script>

<style scoped>
.pet-naming {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(6px, 1.5vmin, 10px);
}
.naming-label {
  font-size: clamp(12px, 2vmin, 14px);
  font-weight: 700;
  color: var(--c-text-primary);
}
.naming-input {
  width: clamp(140px, 35vmin, 180px);
  padding: clamp(5px, 1vmin, 8px) clamp(8px, 2vmin, 14px);
  font-size: clamp(11px, 1.8vmin, 14px);
  font-family: inherit;
  font-weight: 600;
  border: 1.5px solid var(--c-border);
  border-radius: clamp(8px, 1.5vmin, 12px);
  background: var(--c-bg-elevated);
  color: var(--c-text-primary);
  text-align: center;
  outline: none;
  transition: border-color 0.2s;
}
.naming-input:focus { border-color: var(--c-primary); }
.naming-error { font-size: clamp(9px, 1.3vmin, 11px); color: var(--c-primary-dark); font-weight: 600; }
.naming-actions { display: flex; gap: clamp(6px, 1.5vmin, 10px); }
.name-btn {
  padding: clamp(5px, 1vmin, 7px) clamp(14px, 3vmin, 22px);
  font-size: clamp(10px, 1.6vmin, 13px);
  font-weight: 700;
  font-family: inherit;
  border: none;
  border-radius: clamp(10px, 2vmin, 16px);
  cursor: pointer;
  transition: all 0.15s ease;
}
.name-btn:active { transform: scale(0.96); }
.name-btn.confirm {
  background: linear-gradient(145deg, var(--c-primary), var(--c-primary-dark));
  color: var(--c-text-inverse);
  box-shadow: 0 2px 8px rgba(232, 149, 106, 0.3);
}
.name-btn.confirm:disabled { opacity: 0.5; cursor: not-allowed; }
.name-btn.back {
  background: var(--c-bg-elevated);
  color: var(--c-text-secondary);
  border: 1.5px solid var(--c-border);
}
.name-btn.back:hover { background: var(--c-bg-soft); }
</style>
