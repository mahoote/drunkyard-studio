import { supabaseGame } from '../supabaseClient'
import {
    Game,
    GameDto,
    GameInsertDto,
    GamePreview,
    GameTranslation,
    GameTranslationInsertDto,
} from '../types/gameDto'
import { SupabaseResponse } from '../types/supabaseResponse'
import { GameHasAccessoryDto } from '../types/gameHasAccessoryDto'
import { cleanUndefined } from '../utils/objectUtils'

/**
 * Creates a new game.
 * Creates the game translations for the game.
 * @param game
 * @param gameTranslations
 */
async function createGame(game: GameInsertDto, gameTranslations: GameTranslationInsertDto[]) {
    const { data, error }: SupabaseResponse<GameDto> = await supabaseGame
        .from('game')
        .insert([cleanUndefined(game)])
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    if (!data) {
        throw new Error('Error creating game')
    }

    try {
        for (const gameTranslation of gameTranslations) {
            await createGameTranslation({ ...gameTranslation, game_id: data.id })
        }
    } catch (error) {
        console.error('Error creating game translations:', error)
        await deleteNewGame(data.id)
    }

    return data
}

/**
 * Deletes a new game.
 * @param gameId
 */
async function deleteNewGame(gameId: number) {
    const { error }: SupabaseResponse<GameDto> = await supabaseGame
        .from('game')
        .delete()
        .eq('id', gameId)

    if (error) {
        throw new Error(error.message)
    }
}

async function createGameHasAccessory(gameId: number, accessoryId: number) {
    const { error }: SupabaseResponse<GameHasAccessoryDto> = await supabaseGame
        .from('game_has_accessory')
        .insert({ game_id: gameId, accessory_id: accessoryId })

    if (error) {
        throw new Error(error.message)
    }
}

async function createGameHasGameType(gameId: number, gameTypeId: number) {
    const { error }: SupabaseResponse<GameHasAccessoryDto> = await supabaseGame
        .from('game_has_game_type')
        .insert({ game_id: gameId, game_type_id: gameTypeId })

    if (error) {
        throw new Error(error.message)
    }
}

async function createGameTranslation(gameTranslation: GameTranslationInsertDto) {
    const { error }: SupabaseResponse<GameDto> = await supabaseGame
        .from('game_translation')
        .insert([cleanUndefined(gameTranslation)])

    if (error) {
        throw new Error(error.message)
    }
}

/**
 * Fetches a single page of games.
 * @param pageIndex Zero-based page index (0 = first page)
 * @param pageSize Number of games per page (default: 100)
 */
async function getPreviewGamesByPage(pageIndex: number, pageSize = 100) {
    const from = pageIndex * pageSize
    const to = from + pageSize - 1

    const { data, error }: SupabaseResponse<GamePreview[]> = await supabaseGame
        .from('game')
        .select(`id, name, game_translation!left (intro_description)`)
        .range(from, to)

    if (error) {
        console.error(new Error(`Error fetching games: ${error.message}`))
        return []
    }

    if (!data) {
        console.error(new Error('No games found'))
        return []
    }

    return data
}

/**
 * Fetches a game from the game table by its ID.
 * @param gameId
 */
export async function getGame(gameId: number) {
    const { data, error }: SupabaseResponse<Game> = await supabaseGame
        .from('game')
        .select('*')
        .eq('id', gameId)
        .single()

    if (error) {
        console.error(new Error(`Error fetching game: ${error.message}`))
        return null
    }

    return data
}

/**
 * Fetches all the translations for a game by its ID.
 * @param gameId
 */
export async function getGameTranslations(gameId: number) {
    const { data, error }: SupabaseResponse<GameTranslation[]> = await supabaseGame
        .from('game_translation')
        .select('*')
        .eq('game_id', gameId)

    if (error) {
        console.error(new Error(`Error fetching game translations: ${error.message}`))
        return []
    }

    return data
}

export {
    createGame,
    createGameHasAccessory,
    createGameHasGameType,
    deleteNewGame,
    getPreviewGamesByPage,
}
