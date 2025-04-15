export interface GameResponse {
    id: number
    created_at: string
    activity_level: number
    drunk_level: number
    minutes: number
    game_category_id: number
    game_audience_id: number
    has_winner: boolean
    deleted_at?: string
    min_players?: number
    max_players?: number
    game_end_type?: string
    custom_rules_image_url?: string
    name: string

    accessories: {
        accessory: {
            id: number
            accessory_translation: {
                name: string
            }[]
        } | null
    }[]

    game_types: {
        game_type: {
            id: number
            name: string
        } | null
    }[]
}

export interface GameTranslationResponse {
    id: number
    game_id: number
    language: string
    name: string
    intro_description: string
    descriptions: string[]
    custom_end_game_sentence?: string
    has_winner_prompt?: string
}
