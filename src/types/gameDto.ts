import { GenericType } from './genericType'

type GameDto = {
    id: number
    name: string
    intro_description?: string
    descriptions: string[]
    min_players: number
    max_players?: number
    activity_level?: number
    drunk_level?: number
    minutes?: number
    player_group_type_id?: number
    game_audience_id?: number
    game_category: GenericType
    accessories: { id: number }[]
    game_types: { id: number }[]
    created_at: string
}

type GameInsertDto = {
    name: string
    min_players?: number
    max_players?: number
    activity_level?: number
    drunk_level?: number
    minutes?: number
    game_audience_id?: number
    game_category_id: number
    game_end_type: string
    has_winner?: boolean
}

type GameTranslationInsertDto = {
    game_id?: number
    language: string
    name: string
    intro_description?: string
    descriptions: string[]
    custom_end_game_sentence?: string
    has_winner_prompt?: string
}

export interface GamePreview {
    id: number
    name: string
    game_translation: {
        intro_description: string
    }[]
}

export interface Game {
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
}

export type { GameDto, GameInsertDto, GameTranslationInsertDto }
