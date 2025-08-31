export interface ActionCardInsertDto {
    id?: number
    created_at?: string
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

export interface ActionCardTranslationInsertDto {
    id?: number
    action_card_id?: number
    language: string
    action_prompt?: string | null
    custom_card_prompt?: string | null
    excluded_player_prompt?: string | null
    overtime_prompt?: string | null
    texts: string[]
}
