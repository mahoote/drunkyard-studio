export interface GameDescription {
    text: string
    pause?: boolean
}

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
    custom_rules_image?: string
    name: string

    accessories: {
        accessory: {
            id: number
            accessory_translation: {
                language: string
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
    descriptions: GameDescription[]
    has_winner_prompt?: string
}

export interface GamePreviewResponse {
    id: number
    name: string
    active: boolean
    gameTranslation: {
        descriptions: GameDescription[]
    }[]
}
