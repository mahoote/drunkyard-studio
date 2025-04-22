import { AdvancedSettings, NewGame, GameTranslations, WritingSettings } from '../types/newGame'
import { RefObject } from 'react'
import { GameDescription } from '../types/gameResponse'
import { GameLanguage } from '../types/language'
import {
    ActionCardSettings,
    ActionCardSettingsTranslations,
    ActionCardTranslation,
    ActionCardTranslations,
} from '../types/actionCard'

export interface NewGameState {
    resetStore: () => void

    newGame: NewGame
    setNewGame: (game: NewGame) => void

    gameTranslations: GameTranslations
    setGameTranslations: (translations: GameTranslations) => void

    setDescriptions: (descriptions: GameDescription[], language?: GameLanguage) => void
    setSelectedAccessories: (accessories: string[], language?: GameLanguage) => void

    selectedGameTypes: string[]
    setSelectedGameTypes: (gameTypes: string[]) => void

    actionCardSettingsData: ActionCardSettings | undefined
    setActionCardSettingsData: (settings: ActionCardSettings | undefined) => void

    actionCardSettingsTranslations: ActionCardSettingsTranslations
    setActionCardSettingsTranslations: (translations: ActionCardSettingsTranslations) => void

    actionCardTranslations: ActionCardTranslations
    setActionCardTranslations: (translations: ActionCardTranslations) => void

    setActionCards: (
        inputs: ActionCardTranslation[] | undefined,
        language?: GameLanguage
    ) => void

    deletedActionCards: number[] | undefined
    setDeletedActionCards: (deleted: number[] | undefined) => void

    activeFormRef: RefObject<HTMLFormElement> | null
    setActiveFormRef: (ref: RefObject<HTMLFormElement>) => void

    writingSettingsData: WritingSettings | undefined
    setWritingSettingsData: (settings: WritingSettings | undefined) => void

    advancedSettingsData: AdvancedSettings
    setAdvancedSettingsData: (settings: AdvancedSettings) => void

    formStepIndex: number
    setFormStepIndex: (step: number) => void
}
