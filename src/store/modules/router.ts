import { create } from 'zustand'

interface RouterStore {
  key: number
  trigger: () => void
}

export const useRouterStore = create<RouterStore>((set, get) => ({
  key: 0,
  trigger: () => {
    set({ key: get().key + 1 })
  }
}))
