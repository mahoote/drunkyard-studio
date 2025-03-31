export type NewGame = {
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

export type NewGameTranslation = {
    name: string
    introDescription?: string
    descriptions: string[]
    customEndGameSentence?: string
    prompt?: string
    playerCreativePrompt?: string
    actionCardInputs?: string[]
    accessories?: string[]
    hasWinnerPrompt?: string
}

export type NewGameTranslations = {
    [key: string]: NewGameTranslation
}
