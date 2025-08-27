export type ActionCard = {
    id?: number
    stateId: number
    cardLimit?: number
    cardSeconds?: number
    isAutoNext?: boolean
    isPlayerCreative?: boolean
    hasBuzzer?: boolean
    allowSentence: boolean
    canRepeat?: boolean
    excludePlayersAmount?: string
    oneCardPerPlayer?: boolean
}

export interface ActionCardTranslation {
    id?: number
    prompt?: string
    playerCreativePrompt?: string
    texts?: string[]
}

export interface ActionCardTranslations {
    [key: string]: ActionCardTranslation
}
