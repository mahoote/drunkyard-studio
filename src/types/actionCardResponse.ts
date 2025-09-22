export interface ActionCardResponse {
    id: number
    created_at: string
    game_id: number
    included_players: string
    share_card?: boolean
    unique_players?: string
    share_unique_card?: boolean
    excluded_players?: string
    card_repeat?: boolean
    card_limit?: number
    card_seconds?: number
    is_auto_next?: boolean
    player_repeat?: boolean
    one_card_per_player?: boolean
    allow_custom_cards?: boolean
    allow_sentence: boolean
    has_buzzer?: boolean
    has_overtime?: boolean
}

export interface ActionCardTranslationResponse {
    id: number
    action_card_id: number
    language: string
    action_prompt?: string
    custom_card_prompt?: string
    excluded_player_prompt?: string
    overtime_prompt?: string
    buzzed_prompt?: string
    texts: string[]
}
