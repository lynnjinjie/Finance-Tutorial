import { create } from 'zustand'

type NewCategorysState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useNewCategory = create<NewCategorysState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
