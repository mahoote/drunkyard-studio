import { create } from 'zustand'
import { NewGameState } from '../states/newGameState'
import {
    initialActionCardSettingsTranslations,
    initialActionCardsTranslations,
    initialGameTypesData,
    initialNewGameData,
    initialGameTranslations,
} from '../constants/NEW_GAME_FORM_DATA'
import { initialAdvancedSettingsData } from '../constants/ADVANCED_SETTINGS_DATA'
import { persist } from 'zustand/middleware'

export const useNewGameStore = create<NewGameState>()(
    persist(
        set => ({
            newGame: initialNewGameData,
            setNewGame: game => set({ newGame: game }),

            gameTranslations: initialGameTranslations,
            setGameTranslations: translations => set({ gameTranslations: translations }),

            setDescriptions: (descriptions, language = 'en') => {
                set(state => ({
                    gameTranslations: {
                        ...state.gameTranslations,
                        [language]: {
                            ...state.gameTranslations.en,
                            descriptions,
                        },
                    },
                }))
            },

            setSelectedAccessories: (accessories, language = 'en') => {
                set(state => ({
                    gameTranslations: {
                        ...state.gameTranslations,
                        [language]: {
                            ...state.gameTranslations.en,
                            accessories,
                        },
                    },
                }))
            },

            selectedGameTypes: initialGameTypesData,
            setSelectedGameTypes: gameTypes => set({ selectedGameTypes: gameTypes }),

            actionCardSettingsData: undefined,
            setActionCardSettingsData: settings => set({ actionCardSettingsData: settings }),

            actionCardSettingsTranslations: initialActionCardSettingsTranslations,
            setActionCardSettingsTranslations: translations =>
                set({ actionCardSettingsTranslations: translations }),

            actionCardTranslations: initialActionCardsTranslations,
            setActionCardTranslations: translations =>
                set({ actionCardTranslations: translations }),

            setActionCards: (actionCards, language = 'en') => {
                set(state => ({
                    actionCardTranslations: {
                        ...state.actionCardTranslations,
                        [language]: actionCards,
                    },
                }))
            },

            deletedActionCards: undefined,
            setDeletedActionCards: deleted => set({ deletedActionCards: deleted }),

            activeFormRef: null,
            setActiveFormRef: ref => set({ activeFormRef: ref }),

            writingSettingsData: undefined,
            setWritingSettingsData: settings => set({ writingSettingsData: settings }),

            advancedSettingsData: initialAdvancedSettingsData,
            setAdvancedSettingsData: settings => set({ advancedSettingsData: settings }),

            formStepIndex: 0,
            setFormStepIndex: step => set({ formStepIndex: step }),

            resetStore: () => {
                set({
                    newGame: initialNewGameData,
                    gameTranslations: initialGameTranslations,
                    selectedGameTypes: initialGameTypesData,
                    actionCardSettingsData: undefined,
                    actionCardSettingsTranslations: initialActionCardSettingsTranslations,
                    actionCardTranslations: initialActionCardsTranslations,
                    deletedActionCards: undefined,
                    activeFormRef: null,
                    writingSettingsData: undefined,
                    advancedSettingsData: initialAdvancedSettingsData,
                    formStepIndex: 0,
                })
            },
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
