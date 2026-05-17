/**
 * Outfit/Dress-Up Types
 * Pet customization interfaces
 */

export type DressUpCategory = 'accessory' | 'clothing' | 'skin' | 'effect'
export type DressUpSlot = 'accessory' | 'clothing' | 'skin' | 'effect'

export interface Outfit {
  id: string                // predefined ID
  name: string
  category: DressUpCategory
  price: number
  isOwned: boolean
  isEquipped: boolean
}