import { create } from 'zustand'
import { StudioState } from '../states/studioState'

export const useStudioStore = create<StudioState>()(set => ({
    studioAlert: {
        open: false,
        message: '',
        severity: 'success',
    },
    setStudioAlert: alert => set({ studioAlert: alert }),
}))
