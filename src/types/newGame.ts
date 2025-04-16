import { GenericType } from './genericType'

export type NewGame = {
    id?: number
    activityLevel: number
    categoryId: number
    descriptions: string[]
    drunkLevel: number
    minPlayers?: number
    minutes?: number
    name: string
    maxPlayers?: number
    introDescription?: string
    gameAudienceId?: number
}

export type AdvancedSettings = {
    customEndGameSentence?: string
    gameEndType: string
    customRulesImage?: CustomImage
    hasWinner?: boolean
    hasWinnerPrompt?: string
}

export type CustomImage = {
    imageBase64: string
    imageFileType: string
    imageFileExtension: string
}

export type ActionCardSettings = {
    id?: number
    stateId: number
    cardLimit?: number
    cardSeconds?: number
    isAutoNext?: boolean
    prompt?: string
    isPlayerCreative?: boolean
    playerCreativePrompt?: string
    hasBuzzer?: boolean
    allowSentence: boolean
    canRepeat?: boolean
    excludePlayersAmount?: string
    cardBasedTimer?: boolean
    oneCardPerPlayer?: boolean
}
export type WritingSettings = {
    writesAmount: number
    writeSeconds: number
}

export type GameTranslation = {
    id?: number
    name: string
    introDescription?: string
    descriptions: string[]
    customEndGameSentence?: string
    accessories?: string[]
    hasWinnerPrompt?: string
}

export interface ActionCardSettingsTranslation {
    id?: number
    prompt?: string
    playerCreativePrompt?: string
}

export interface CombinedTranslations {
    game: { [key: string]: GameTranslation }
    actionCardSettings?: { [key: string]: ActionCardSettingsTranslation }
    actionCards?: { [key: string]: GenericType[] | undefined }
}

export interface ActionCardTranslations {
    [key: string]: GenericType[] | undefined
}

export type GameTranslations = {
    [key: string]: GameTranslation
}

export interface ActionCardSettingsTranslations {
    [key: string]: ActionCardSettingsTranslation
}
