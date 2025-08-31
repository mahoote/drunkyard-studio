export type ActionCard = {
    id?: number
    cardLimit?: number | null
    cardSeconds?: number
    isAutoNext?: boolean
    allowCustomCards?: boolean
    hasBuzzer?: boolean
    allowSentence: boolean
    cardRepeat?: boolean
    oneCardPerPlayer?: boolean
    includedPlayersAmount?: string
    includedPlayersToggle?: string
    shareCard?: boolean
    uniquePlayers?: string
    shareUniqueCard?: boolean
    excludedPlayers?: string
    playerRepeat?: boolean
    hasOvertime?: boolean
}

export interface ActionCardTranslation {
    id?: number
    actionPrompt?: string
    customCardPrompt?: string
    excludedPlayerPrompt?: string
    overtimePrompt?: string
    texts?: string[]
}

export interface ActionCardTranslations {
    [key: string]: ActionCardTranslation
}
