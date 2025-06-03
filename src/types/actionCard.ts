export interface ActionCardTranslation {
    id?: number
    value: string
    actionCardId?: number
}

export type ActionCardSettings = {
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

export interface ActionCardSettingsTranslation {
    id?: number
    prompt?: string
    playerCreativePrompt?: string
}

export interface ActionCardTranslations {
    [key: string]: ActionCardTranslation[] | undefined
}

export interface ActionCardSettingsTranslations {
    [key: string]: ActionCardSettingsTranslation
}
