import { supabaseGame } from '../supabaseClient'
import { Game, GameInsertDto, GameTranslationInsertDto } from '../types/gameDto'
import { SupabaseResponse } from '../types/supabaseResponse'
import { GameHasAccessoryDto } from '../types/gameHasAccessoryDto'
import { cleanUndefined } from '../utils/objectUtils'
import {
    GamePreviewResponse,
    GameResponse,
    GameTranslationResponse,
} from '../types/gameResponse'
import { supabaseFunction } from '../utils/supabaseUtils'

/**
 * Creates a new game.
 * Creates the game translations for the game.
 * @param game
 * @param gameTranslations
 */
async function createGame(game: GameInsertDto, gameTranslations: GameTranslationInsertDto[]) {
    const { data, error }: SupabaseResponse<Game> = await supabaseGame
        .from('game')
        .upsert(cleanUndefined(game))
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
    const { error } = await supabaseGame.from('game').delete().eq('id', gameId)

    if (error) {
        throw new Error(error.message)
    }
}

async function createGameHasAccessory(gameId: number, accessoryId: number) {
    const { error }: SupabaseResponse<GameHasAccessoryDto> = await supabaseGame
        .from('game_has_accessory')
        .upsert(
            { game_id: gameId, accessory_id: accessoryId },
            { onConflict: 'game_id,accessory_id' }
        )

    if (error) {
        throw new Error(error.message)
    }
}

async function createGameHasGameType(gameId: number, gameTypeId: number) {
    // First, delete any existing game type for the game.
    const { error: deleteError } = await supabaseGame
        .from('game_has_game_type')
        .delete()
        .eq('game_id', gameId)

    if (deleteError) {
        console.error('Error deleting existing game type:', deleteError.message)
    }

    const { error }: SupabaseResponse<GameHasAccessoryDto> = await supabaseGame
        .from('game_has_game_type')
        .upsert(
            { game_id: gameId, game_type_id: gameTypeId },
            { onConflict: 'game_id,game_type_id' }
        )

    if (error) {
        throw new Error(error.message)
    }
}

async function createGameTranslation(gameTranslation: GameTranslationInsertDto) {
    const { error } = await supabaseGame
        .from('game_translation')
        .upsert(cleanUndefined(gameTranslation))

    if (error) {
        throw new Error(error.message)
    }
}

/**
 * Fetches a game from the game table by its ID.
 * @param gameId
 */
export async function getGame(gameId: number) {
    const { data, error }: SupabaseResponse<GameResponse> = await supabaseGame
        .from('game')
        .select(
            `
    *,
    accessories:game_has_accessory!left (
      accessory:accessory_id (
        id,
        accessory_translation (
          language,
          name
        )
      )
    ),
    game_types:game_has_game_type!left (
      game_type:game_type_id (
        id,
        name
      )
    )
  `
        )
        .eq('id', gameId)
        .single()

    if (error) {
        throw new Error(`Error fetching game: ${error.message}`)
    }

    return data
}

/**
 * Fetches all the translations for a game by its ID.
 * @param gameId
 */
export async function getGameTranslations(gameId: number) {
    const { data, error }: SupabaseResponse<GameTranslationResponse[]> = await supabaseGame
        .from('game_translation')
        .select('*')
        .eq('game_id', gameId)

    if (error) {
        throw new Error(`Error fetching game translations: ${error.message}`)
    }

    return data
}

/**
 * Calls the edge function to get game previews by page and size
 */
export async function getPreviewGamesByPage(pageIndex: number = 0, pageSize: number = 100) {
    const { data, error } = await supabaseFunction<GamePreviewResponse[]>(
        `game/previews?page=${pageIndex}&size=${pageSize}`,
        {
            method: 'GET',
        }
    )

    if (error || !data) {
        throw new Error('Failed to get game previews. ' + (error?.message ?? 'Unknown error'))
    }

    return data
}

/**
 * Calls the edge function to set a game as active or inactive.
 * @param id
 * @param active
 */
export async function setGameActive(id: number, active: boolean) {
    const { error } = await supabaseFunction('game/active', {
        method: 'PUT',
        body: { id, active },
    })

    if (error) {
        throw new Error('Failed to set game active. ' + error.message)
    }
}

export { createGame, createGameHasAccessory, createGameHasGameType, deleteNewGame }
