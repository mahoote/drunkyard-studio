import { create } from 'zustand'
import { NewGameState } from '../states/newGameState'
import {
    initialActionCardTranslations,
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

            actionCardState: undefined,
            setActionCardDataState: settings => set({ actionCardState: settings }),

            actionCardTranslationsState: initialActionCardTranslations,
            setActionCardTranslationsState: translations =>
                set({ actionCardTranslationsState: translations }),

            setActionCardTexts: (texts?: string[], language = 'en') => {
                set(state => ({
                    actionCardTranslationsState: {
                        ...state.actionCardTranslationsState,
                        [language]: {
                            ...(state.actionCardTranslationsState?.[language] ?? {}),
                            texts,
                        },
                    },
                }))
            },

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
                    actionCardState: undefined,
                    actionCardTranslationsState: initialActionCardTranslations,
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
