import { AdvancedSettings, NewGame, GameTranslations, WritingSettings } from '../types/newGame'
import { RefObject } from 'react'
import { GameDescription } from '../types/gameResponse'
import { GameLanguage } from '../types/language'
import { ActionCard, ActionCardTranslations } from '../types/actionCard'

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

    actionCardState: ActionCard | undefined
    setActionCardDataState: (settings: ActionCard | undefined) => void

    actionCardTranslationsState: ActionCardTranslations
    setActionCardTranslationsState: (translations: ActionCardTranslations) => void

    setActionCardTexts: (text?: string[], language?: GameLanguage) => void

    activeFormRef: RefObject<HTMLFormElement> | null
    setActiveFormRef: (ref: RefObject<HTMLFormElement>) => void

    writingSettingsData: WritingSettings | undefined
    setWritingSettingsData: (settings: WritingSettings | undefined) => void

    advancedSettingsData: AdvancedSettings
    setAdvancedSettingsData: (settings: AdvancedSettings) => void

    formStepIndex: number
    setFormStepIndex: (step: number) => void
}
