import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getInitialState } from './tools'

interface MenuStore {
  activeKey: string
  setActiveKey: (key: string) => void
}

export const useMenuStore = create<MenuStore, [['zustand/persist', MenuStore]]>(
  persist(
    (set) => ({
      ...getInitialState('menu', {
        activeKey: ''
      }),
      setActiveKey: (activeKey: string) => set({ activeKey })
    }),
    {
      name: 'menu',
      storage: createJSONStorage(() => localStorage)
    }
  )
)
