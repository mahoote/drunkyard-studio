import { GameDescription } from './gameResponse'
import { ActionCardSettingsTranslation, ActionCardTranslation } from './actionCard'

export type NewGame = {
    id?: number
    activityLevel: number
    categoryId: number
    drunkLevel: number
    minPlayers?: number
    minutes?: number
    maxPlayers?: number
    gameAudienceId?: number
}

export type AdvancedSettings = {
    gameEndType: string
    customRulesImage?: CustomImage
    hasWinner?: boolean
}

export type CustomImage = {
    imageBase64: string
    imageFileType: string
    imageFileExtension: string
}

export type WritingSettings = {
    writesAmount: number
    writeSeconds: number
}

export type GameTranslation = {
    id?: number
    name: string
    descriptions: GameDescription[]
    customEndGameSentence?: string
    accessories?: string[]
    hasWinnerPrompt?: string
}

export interface CombinedTranslations {
    game: { [key: string]: GameTranslation }
    actionCardSettings?: { [key: string]: ActionCardSettingsTranslation }
    actionCards?: { [key: string]: ActionCardTranslation[] | undefined }
}

export type GameTranslations = {
    [key: string]: GameTranslation
}
