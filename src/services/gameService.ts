import { supabaseGame } from '../supabaseClient'
import { GameDto, GameInsertDto, GameTranslationInsertDto } from '../types/gameDto'
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

export { createGame, createGameHasAccessory, createGameHasGameType, deleteNewGame }
