export interface ActionCardResponse {
    id: number
    game_id: number
    state_id: number
    card_limit?: number
    card_seconds?: number
    is_auto_next: boolean
    is_player_creative: boolean
    has_buzzer: boolean
    created_at: string
    allow_sentence: boolean
    can_repeat: boolean
    exclude_players_amount?: string
    one_card_per_player: boolean
}

export interface ActionCardTranslationResponse {
    id: number
    action_card_settings_id: number
    language: string
    prompt?: string
    player_creative_prompt?: string
    texts: string[]
}
