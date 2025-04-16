import { create } from 'zustand'
import { NewGameState } from '../states/newGameState'
import {
    initialAccessoriesData,
    initialActionCardSettingsTranslations,
    initialActionCardsTranslations,
    initialGameTypesData,
    initialNewGameData,
    initialNewGameTranslations,
} from '../constants/NEW_GAME_FORM_DATA'
import { initialAdvancedSettingsData } from '../constants/ADVANCED_SETTINGS_DATA'
import { persist } from 'zustand/middleware'

export const useNewGameStore = create<NewGameState>()(
    persist(
        set => ({
            newGame: initialNewGameData,
            setNewGame: game => set({ newGame: game }),

            descriptions: initialNewGameData.descriptions,
            setDescriptions: descriptions => set({ descriptions }),

            selectedAccessories: initialAccessoriesData,
            setSelectedAccessories: accessories => set({ selectedAccessories: accessories }),

            selectedGameTypes: initialGameTypesData,
            setSelectedGameTypes: gameTypes => set({ selectedGameTypes: gameTypes }),

            actionCardSettingsData: undefined,
            setActionCardSettingsData: settings => set({ actionCardSettingsData: settings }),

            actionCardInputs: undefined,
            setActionCardInputs: inputs => set({ actionCardInputs: inputs }),

            activeFormRef: null,
            setActiveFormRef: ref => set({ activeFormRef: ref }),

            writingSettingsData: undefined,
            setWritingSettingsData: settings => set({ writingSettingsData: settings }),

            advancedSettingsData: initialAdvancedSettingsData,
            setAdvancedSettingsData: settings => set({ advancedSettingsData: settings }),

            newGameTranslations: initialNewGameTranslations,
            setNewGameTranslations: translations => set({ newGameTranslations: translations }),

            formStepIndex: 0,
            setFormStepIndex: step => set({ formStepIndex: step }),

            actionCardSettingsTranslations: initialActionCardSettingsTranslations,
            setActionCardSettingsTranslations: translations =>
                set({ actionCardSettingsTranslations: translations }),

            actionCardTranslations: initialActionCardsTranslations,
            setActionCardTranslations: translations =>
                set({ actionCardTranslations: translations }),
        }),
        {
            name: 'newGameStorage',
            partialize: state => ({
                ...state,
                activeFormRef: undefined, // Exclude non-serializable values like refs
            }),
        }
    )
)
