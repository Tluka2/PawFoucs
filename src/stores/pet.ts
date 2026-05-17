import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { StorageService } from '../services/storage/index.ts';
import type { Pet, PetType, MoodState } from '../types/index.ts';

const storage = new StorageService();

function createDefaultPet(type: PetType, name: string): Pet {
  return {
    id: `pet-${Date.now()}`,
    name,
    type,
    level: 1,
    exp: 0,
    mood: 'happy',
    isUnlocked: true,
    isSelected: true,
    unlockDate: new Date().toISOString(),
    lastInteractAt: new Date().toISOString(),
  };
}

export const usePetStore = defineStore('pet', () => {
  const pets = ref<Pet[]>([]);
  const currentPetId = ref('');
  const isLoaded = ref(false);
  let saveQueue = Promise.resolve();

  const currentPet = computed<Pet | undefined>(() =>
    pets.value.find((p) => p.id === currentPetId.value)
  );

  const unlockedPets = computed<Pet[]>(() =>
    pets.value.filter((p) => p.isUnlocked)
  );

  async function load(): Promise<void> {
    const allPets = await storage.getAll('pets');
    pets.value = allPets as Pet[];
    const selected = pets.value.find((p) => p.isSelected);
    if (selected) currentPetId.value = selected.id;
    isLoaded.value = true;
  }

  async function savePet(pet: Pet): Promise<void> {
    saveQueue = saveQueue.then(async () => {
      await storage.save('pets', pet);
      const idx = pets.value.findIndex((p) => p.id === pet.id);
      if (idx >= 0) {
        pets.value[idx] = pet;
      } else {
        pets.value.push(pet);
      }
    });
    return saveQueue;
  }

  async function selectPet(petId: string): Promise<void> {
    for (const pet of pets.value) {
      pet.isSelected = pet.id === petId;
      await savePet(pet);
    }
    currentPetId.value = petId;
  }

  function validatePetName(name: string): string {
    const trimmed = name.trim();
    if (trimmed.length < 1 || trimmed.length > 10) {
      throw new Error('Pet name must be 1-10 characters');
    }
    return trimmed;
  }

  async function addInitialPet(type: PetType, name: string): Promise<Pet> {
    const validName = validatePetName(name);
    for (const pet of pets.value) {
      if (pet.isSelected) {
        pet.isSelected = false;
        await savePet(pet);
      }
    }
    const newPet = createDefaultPet(type, validName);
    await savePet(newPet);
    currentPetId.value = newPet.id;
    return newPet;
  }

  async function addExp(amount: number): Promise<void> {
    const pet = currentPet.value;
    if (!pet) return;
    pet.exp += amount;
    while (pet.exp >= pet.level * 100) {
      pet.exp -= pet.level * 100;
      pet.level += 1;
    }
    pet.lastInteractAt = new Date().toISOString();
    await savePet(pet);
  }

  function updateMood(mood: MoodState): void {
    const pet = currentPet.value;
    if (!pet) return;
    pet.mood = mood;
    savePet(pet);
  }

  async function unlockPet(type: PetType, name: string): Promise<Pet> {
    const validName = validatePetName(name);
    const newPet = createDefaultPet(type, validName);
    newPet.isSelected = false;
    await savePet(newPet);
    return newPet;
  }

  async function renamePet(petId: string, name: string): Promise<void> {
    const validName = validatePetName(name);
    const pet = pets.value.find((p) => p.id === petId);
    if (!pet) throw new Error('Pet not found');
    pet.name = validName;
    await savePet(pet);
  }

  return {
    pets, currentPetId, isLoaded,
    currentPet, unlockedPets,
    load, savePet, selectPet, validatePetName, addInitialPet, addExp, updateMood, unlockPet, renamePet,
  };
});
