import {
    ActionCardSettings,
    AdvancedSettings,
    NewGame,
    GameTranslations,
    WritingSettings,
    ActionCardSettingsTranslations,
    ActionCardTranslations,
} from '../types/newGame'
import { RefObject } from 'react'
import { GenericType } from '../types/genericType'
import { GameDescription } from '../types/gameResponse'

export interface NewGameState {
    newGame: NewGame
    setNewGame: (game: NewGame) => void

    descriptions: GameDescription[]
    setDescriptions: (descriptions: GameDescription[]) => void

    selectedAccessories: string[]
    setSelectedAccessories: (accessories: string[]) => void

    selectedGameTypes: string[]
    setSelectedGameTypes: (gameTypes: string[]) => void

    actionCardSettingsData: ActionCardSettings | undefined
    setActionCardSettingsData: (settings: ActionCardSettings | undefined) => void

    actionCardInputs: GenericType[] | undefined
    setActionCardInputs: (inputs: GenericType[] | undefined) => void

    activeFormRef: RefObject<HTMLFormElement> | null
    setActiveFormRef: (ref: RefObject<HTMLFormElement>) => void

    writingSettingsData: WritingSettings | undefined
    setWritingSettingsData: (settings: WritingSettings | undefined) => void

    advancedSettingsData: AdvancedSettings
    setAdvancedSettingsData: (settings: AdvancedSettings) => void

    newGameTranslations: GameTranslations
    setNewGameTranslations: (translations: GameTranslations) => void

    actionCardSettingsTranslations: ActionCardSettingsTranslations
    setActionCardSettingsTranslations: (translations: ActionCardSettingsTranslations) => void

    actionCardTranslations: ActionCardTranslations
    setActionCardTranslations: (translations: ActionCardTranslations) => void

    formStepIndex: number
    setFormStepIndex: (step: number) => void
}
