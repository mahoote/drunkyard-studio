export type ActionCardDto = {
    id: number
    game_id: number
    state_id: number
    card_limit?: number
    card_seconds?: number
    is_auto_next?: boolean
    is_player_creative?: boolean
    prompt?: string
    has_buzzer?: boolean
}

export type ActionCardInsertDto = {
    id?: number
    game_id: number
    state_id: number
    card_limit?: number
    card_seconds?: number
    is_auto_next?: boolean
    is_player_creative?: boolean
    has_buzzer?: boolean
    allow_sentence: boolean
    can_repeat?: boolean
    exclude_players_amount?: string
    one_card_per_player?: boolean
}

export type ActionCardTranslationInsertDto = {
    id?: number
    action_card_id?: number
    language: string
    prompt?: string | null
    player_creative_prompt?: string | null
    texts: string[]
}
