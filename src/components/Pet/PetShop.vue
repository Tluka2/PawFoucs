<template>
  <div class="pet-shop">
    <div class="shop-header">
      <span class="shop-title"><AppIcon name="catPaw" :size="18" /> 宠物商店</span>
      <span class="coin-badge"><AppIcon name="coins" :size="14" /> {{ userStore.formattedCoins }}</span>
    </div>

    <div class="shop-grid">
      <div
        v-for="item in shopItems"
        :key="item.type"
        class="shop-card"
        :class="{ owned: item.owned, selected: item.isSelected }"
      >
        <PetSprite :pet-type="item.type" size="sm" />
        <div class="shop-name">{{ item.label }}</div>

        <!-- Owned: show name + switch button -->
        <template v-if="item.owned">
          <div class="shop-pet-name">{{ item.petName }}</div>
          <div class="owned-actions">
            <button
              v-if="!item.isSelected"
              class="btn-switch"
              @click="handleSwitch(item)"
            >切换</button>
            <div v-else class="using-tag">使用中</div>
            <button class="btn-rename" @click="handleRename(item)">改名</button>
          </div>
        </template>

        <!-- Locked: show price + buy button -->
        <template v-else>
          <div class="shop-price"><AppIcon name="coins" :size="14" /> {{ item.price }}</div>
          <button
            class="btn-buy"
            :class="{ disabled: userStore.coins < item.price }"
            @click="handleBuy(item)"
          >
            {{ userStore.coins >= item.price ? '购买' : '金币不足' }}
          </button>
        </template>
      </div>
    </div>

    <!-- Buy / Rename dialog -->
    <div v-if="showNameDialog" class="dialog-overlay" @click.self="cancelDialog">
      <div class="dialog-inner">
        <div class="dialog-title">{{ dialogMode === 'buy' ? '给新伙伴取个名字' : '给伙伴改个名字' }}</div>
        <div class="dialog-pet-preview" v-if="dialogMode === 'buy'">
          <PetSprite :pet-type="buyingType" size="sm" />
        </div>
        <div class="dialog-cost" v-if="dialogMode === 'rename'">
          <AppIcon name="coins" :size="14" /> 花费 {{ RENAME_COST }} 金币
        </div>
        <input
          v-model="newPetName"
          class="dialog-input"
          placeholder="1-10个字符"
          maxlength="10"
          @keydown.enter="confirmDialog"
          ref="nameInputRef"
        />
        <div class="dialog-hint" v-if="nameError">{{ nameError }}</div>
        <div class="dialog-btns">
          <button class="btn-dialog-cancel" @click="cancelDialog">取消</button>
          <button class="btn-dialog-ok" @click="confirmDialog">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { usePetStore } from '@/stores/pet'
import { useUserStore } from '@/stores/user'
import PetSprite from './PetSprite.vue'
import { useSound } from '@/composables/useSound'
import AppIcon from '@/components/AppIcon.vue'
import type { PetType } from '@/types/pet'

const petStore = usePetStore()
const userStore = useUserStore()
const { playPurchaseSound } = useSound()

const RENAME_COST = 100

const showNameDialog = ref(false)
const dialogMode = ref<'buy' | 'rename'>('buy')
const buyingType = ref<PetType>('cat')
const renamePetId = ref('')
const newPetName = ref('')
const nameError = ref('')
const nameInputRef = ref<HTMLInputElement | null>(null)

interface ShopItem {
  type: PetType
  label: string
  price: number
  owned: boolean
  petName: string
  isSelected: boolean
}

const PET_META: Record<PetType, { label: string; price: number }> = {
  cat:     { label: '小猫', price: 0 },
  dog:     { label: '小狗', price: 500 },
}

const shopItems = computed<ShopItem[]>(() => {
  const typeOrder: PetType[] = ['cat', 'dog']
  return typeOrder.map(type => {
    const pet = petStore.pets.find(p => p.type === type)
    return {
      type,
      label: PET_META[type].label,
      price: PET_META[type].price,
      owned: !!pet,
      petName: pet?.name || '',
      isSelected: pet?.isSelected ?? false,
    }
  })
})

function handleBuy(item: ShopItem) {
  if (userStore.coins < item.price) return
  dialogMode.value = 'buy'
  buyingType.value = item.type
  newPetName.value = ''
  nameError.value = ''
  showNameDialog.value = true
}

function handleRename(item: ShopItem) {
  if (userStore.coins < RENAME_COST) {
    nameError.value = '金币不足'
    return
  }
  dialogMode.value = 'rename'
  const pet = petStore.pets.find(p => p.type === item.type)
  renamePetId.value = pet?.id || ''
  newPetName.value = item.petName
  nameError.value = ''
  showNameDialog.value = true
}

function cancelDialog() {
  showNameDialog.value = false
  nameError.value = ''
}

watch(showNameDialog, (v) => {
  if (v) nextTick(() => nameInputRef.value?.focus())
})

async function confirmDialog() {
  const name = newPetName.value.trim()
  if (!name) {
    nameError.value = '请输入名字'
    return
  }
  if (name.length > 10) {
    nameError.value = '名字不能超过10个字符'
    return
  }

  if (dialogMode.value === 'buy') {
    const item = shopItems.value.find(i => i.type === buyingType.value)
    if (!item) return

    if (!userStore.spendCoins(item.price)) {
      nameError.value = '金币不足'
      return
    }

    try {
      await petStore.unlockPet(buyingType.value, name)
      playPurchaseSound()
      showNameDialog.value = false
      await userStore.save()
    } catch (e) {
      userStore.addCoins(item.price)
      nameError.value = '购买失败，请重试'
      console.error('Buy pet failed:', e)
    }
  } else {
    // Rename mode
    if (!userStore.spendCoins(RENAME_COST)) {
      nameError.value = '金币不足'
      return
    }

    try {
      await petStore.renamePet(renamePetId.value, name)
      playPurchaseSound()
      showNameDialog.value = false
      await userStore.save()
    } catch (e) {
      userStore.addCoins(RENAME_COST)
      nameError.value = '改名失败，请重试'
      console.error('Rename pet failed:', e)
    }
  }
}

async function handleSwitch(item: ShopItem) {
  const pet = petStore.pets.find(p => p.type === item.type)
  if (pet) await petStore.selectPet(pet.id)
}
</script>

<style scoped>
.pet-shop {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--c-bg);
  overflow-y: auto;
}

.shop-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: clamp(8px, 2vmin, 12px) clamp(8px, 2vmin, 14px);
  border-bottom: 1px solid var(--c-border);
}

.shop-title {
  font-weight: 700;
  font-size: clamp(16px, 2.8vmin, 20px);
  color: var(--c-text-primary);
}

.coin-badge {
  font-size: clamp(12px, 1.8vmin, 15px);
  font-weight: 700;
  color: var(--c-primary);
  background: var(--c-primary-soft);
  padding: clamp(2px, 0.5vmin, 4px) clamp(8px, 2vmin, 12px);
  border-radius: clamp(10px, 2vmin, 16px);
}

.shop-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(10px, 2.5vmin, 16px);
  padding: clamp(12px, 3vmin, 20px) clamp(10px, 2.5vmin, 16px);
}

.shop-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(3px, 0.6vmin, 5px);
  padding: clamp(8px, 2vmin, 14px) clamp(4px, 1vmin, 8px);
  background: var(--c-bg-elevated);
  border: 2px solid var(--c-border);
  border-radius: clamp(12px, 2vmin, 16px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  overflow: hidden;
}

.shop-card :deep(.pet-pixel-container.sm) {
  width: clamp(40px, 10vmin, 64px);
  height: clamp(40px, 10vmin, 64px);
}

.shop-card :deep(.pet-canvas) {
  width: 100%;
  height: 100%;
}

.shop-card.owned {
  border-color: var(--c-secondary-light);
}

.shop-card.selected {
  border-color: var(--c-secondary);
  background: var(--c-secondary-soft);
}

.shop-name {
  font-size: clamp(11px, 1.6vmin, 14px);
  font-weight: 700;
  color: var(--c-text-primary);
}

.shop-pet-name {
  font-size: clamp(9px, 1.2vmin, 11px);
  color: var(--c-secondary);
  font-weight: 600;
}

.shop-price {
  font-size: clamp(10px, 1.4vmin, 12px);
  font-weight: 700;
  color: var(--c-primary-dark);
}

.btn-buy {
  padding: clamp(3px, 0.6vmin, 5px) clamp(10px, 2.5vmin, 16px);
  background: linear-gradient(145deg, var(--c-primary), var(--c-primary-dark));
  color: var(--c-text-inverse);
  border: none;
  border-radius: clamp(8px, 1.5vmin, 12px);
  font-size: clamp(10px, 1.4vmin, 12px);
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-buy:hover { transform: translateY(-1px); }
.btn-buy.disabled {
  background: var(--c-border);
  cursor: not-allowed;
  transform: none;
}

.btn-switch {
  padding: clamp(3px, 0.6vmin, 5px) clamp(10px, 2.5vmin, 16px);
  background: var(--c-bg-elevated);
  color: var(--c-secondary);
  border: 1.5px solid var(--c-secondary);
  border-radius: clamp(8px, 1.5vmin, 12px);
  font-size: clamp(10px, 1.4vmin, 12px);
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}

.owned-actions {
  display: flex;
  gap: clamp(4px, 1vmin, 6px);
  align-items: center;
}

.btn-rename {
  padding: clamp(2px, 0.5vmin, 4px) clamp(6px, 1.5vmin, 10px);
  background: var(--c-bg-elevated);
  color: var(--c-text-muted);
  border: 1.5px solid var(--c-border);
  border-radius: clamp(6px, 1vmin, 8px);
  font-size: clamp(9px, 1.2vmin, 11px);
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-rename:hover {
  color: var(--c-primary);
  border-color: var(--c-primary);
  background: var(--c-primary-soft);
}

.btn-switch:hover { background: var(--c-secondary-soft); }

.using-tag {
  font-size: clamp(9px, 1.2vmin, 11px);
  font-weight: 700;
  color: var(--c-secondary);
  background: var(--c-secondary-soft);
  padding: clamp(2px, 0.5vmin, 4px) clamp(8px, 2vmin, 12px);
  border-radius: clamp(6px, 1vmin, 8px);
}

/* ===== Dialog ===== */
.dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-inner {
  background: var(--c-bg-elevated);
  border-radius: clamp(12px, 2vmin, 16px);
  padding: clamp(12px, 3vmin, 20px);
  width: clamp(220px, 60vmin, 280px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(6px, 1.5vmin, 10px);
}

.dialog-title {
  font-size: clamp(14px, 2.2vmin, 17px);
  font-weight: 700;
  color: var(--c-text-primary);
}

.dialog-cost {
  font-size: clamp(11px, 1.6vmin, 13px);
  font-weight: 600;
  color: var(--c-primary-dark);
  background: var(--c-primary-soft);
  padding: clamp(3px, 0.8vmin, 5px) clamp(10px, 2vmin, 14px);
  border-radius: clamp(8px, 1.5vmin, 12px);
  display: flex;
  align-items: center;
  gap: 4px;
}

.dialog-pet-preview {
  display: flex;
  justify-content: center;
  padding: clamp(4px, 1vmin, 8px) 0;
}

.dialog-input {
  width: 100%;
  padding: clamp(5px, 1vmin, 8px) clamp(8px, 1.5vmin, 10px);
  border: 1.5px solid var(--c-border);
  border-radius: clamp(6px, 1vmin, 8px);
  font-size: clamp(12px, 1.8vmin, 15px);
  font-family: inherit;
  outline: none;
  color: var(--c-text-primary);
  box-sizing: border-box;
  text-align: center;
}

.dialog-input:focus { border-color: var(--c-primary); }

.dialog-hint {
  font-size: clamp(9px, 1.2vmin, 11px);
  color: var(--c-danger);
  font-weight: 600;
}

.dialog-btns {
  display: flex;
  gap: clamp(6px, 1.5vmin, 10px);
  width: 100%;
}

.btn-dialog-cancel, .btn-dialog-ok {
  flex: 1;
  padding: clamp(5px, 1vmin, 7px);
  border-radius: clamp(6px, 1vmin, 8px);
  font-size: clamp(12px, 1.7vmin, 14px);
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  border: none;
}

.btn-dialog-cancel {
  background: var(--c-border);
  color: var(--c-text-secondary);
}

.btn-dialog-ok {
  background: var(--c-primary);
  color: var(--c-text-inverse);
}

.btn-dialog-ok:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
