import { ActionCardState } from '../states/actionCardState'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getActionCardStates } from '../services/actionCardService'
import { canFetchData } from '../utils/apiUtils'

export const useActionCardStore = create<ActionCardState>()(
    persist(
        set => ({
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),

            error: null,
            setError: (error: Error | null) => set({ error }),

            actionCardStates: [],
            setActionCardStates: actionCardStates => set({ actionCardStates }),

            fetchApi: () => {
                if (canFetchData('actionCardOptionsLastFetched')) {
                    set({ loading: true })
                    void fetchActionCardOptionsAsync(set).finally(() => {
                        set({ loading: false })
                    })
                }
            },
        }),
        {
            name: 'actionCardStorage',
        }
    )
)

/**
 * Fetches action card options from the API and stores them in the store.
 */
const fetchActionCardOptionsAsync = async (
    set: (partial: Partial<ActionCardState>) => void
) => {
    try {
        const [actionCardStates] = await Promise.all([getActionCardStates()])

        set({ actionCardStates })

        localStorage.setItem('actionCardOptionsLastFetched', new Date().getTime().toString())
    } catch (error) {
        const errorInstance = error instanceof Error ? error : new Error('Unknown error')
        set({ error: errorInstance })
    }
}
