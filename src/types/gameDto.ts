import { GameDescription } from './gameResponse'

type Game = {
    id: number
    created_at: string
    deleted_at?: string
    min_players: number
    max_players?: number
    activity_level: number
    drunk_level: number
    minutes: number
    game_end_type: string
    game_category_id: number
    game_audience_id?: number
    custom_rules_image?: string
    name: string
    has_winner: boolean
}

type GameInsertDto = {
    id?: number
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
    id?: number
    game_id?: number
    language: string
    name: string
    descriptions: GameDescription[]
    custom_end_game_sentence?: string
    has_winner_prompt?: string
}

export type { Game, GameInsertDto, GameTranslationInsertDto }
