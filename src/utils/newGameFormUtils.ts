import {
    createGame,
    createGameHasAccessory,
    createGameHasGameType,
    deleteGameHasGameType,
} from '../services/gameService'
import { GameInsertDto, GameTranslationInsertDto } from '../types/gameDto'
import { GenericType } from '../types/genericType'
import { AdvancedSettings, NewGame, GameTranslations } from '../types/newGame'
import { createAccessory, removeAllGameAccessories } from '../services/accessoryService'
import { removeLastFetched } from './storageUtils'
import { validNaturalNumber, validString } from './inputUtils'

/**
 * Creates a new game as well as the accessories and game types associated with it.
 * @param newGameData
 * @param advancedDefaultSettings
 * @param gameTranslations
 */
export async function createNewGame(
    newGameData: NewGame,
    advancedDefaultSettings: AdvancedSettings,
    gameTranslations: GameTranslations
) {
    // New Game
    const gameInsertDto: GameInsertDto = {
        id: newGameData.id,
        name: gameTranslations.en.name,
        min_players: validNaturalNumber(newGameData.minPlayers),
        max_players: validNaturalNumber(newGameData.maxPlayers),
        activity_level: newGameData.activityLevel,
        drunk_level: newGameData.drunkLevel,
        minutes: validNaturalNumber(newGameData.minutes),
        game_audience_id: validNaturalNumber(newGameData.gameAudienceId),
        game_category_id: newGameData.categoryId,
        game_end_type: advancedDefaultSettings.gameEndType,
        has_winner: advancedDefaultSettings.hasWinner,
    }

    // New Game Translations
    const newGameTranslationInsertDtos: GameTranslationInsertDto[] = []

    Object.entries(gameTranslations).forEach(([key, translation]) => {
        newGameTranslationInsertDtos.push({
            id: translation.id,
            language: key,
            name: translation.name,
            descriptions: translation.descriptions,
            has_winner_prompt: validString(translation.hasWinnerPrompt),
        })
    })

    return await createGame(gameInsertDto, newGameTranslationInsertDtos)
}

/**
 * Iterates through the selected accessories and adds them to the new game.
 * @param accessories
 * @param newGameId
 * @param gameTranslations
 */
export async function addAccessoriesToGame(
    accessories: GenericType[] | null,
    newGameId: number,
    gameTranslations: GameTranslations
) {
    const selectedAccessoriesEn = gameTranslations.en.accessories ?? []

    // First remove all games asociated with the new game.
    await removeAllGameAccessories(newGameId)

    for (const accessory of selectedAccessoriesEn) {
        const index = selectedAccessoriesEn.indexOf(accessory)

        let accessoryId = accessories?.find(
            accessoryItem => accessoryItem.name === accessory
        )?.id

        // Create accessory if it does not exist.
        if (!accessoryId) {
            // New Game Translations
            const accessoryTranslations: { language: string; name: string }[] = []

            Object.entries(gameTranslations).forEach(([key, translation]) => {
                accessoryTranslations.push({
                    language: key,
                    name: translation.accessories?.[index] ?? accessory,
                })
            })

            const newAccessory = await createAccessory(accessoryTranslations)
            accessoryId = newAccessory?.id

            // Remove the last fetched game options to force a re-fetch.
            removeLastFetched()
        }

        if (accessoryId) {
            await createGameHasAccessory(newGameId, accessoryId)
        }
    }
}

/**
 * First, delete any existing game type for the game.
 * Iterates through the selected game types and adds them to the new game.
 * @param selectedGameTypes
 * @param gameTypes
 * @param newGameId
 */
export async function addGameTypesToGame(
    selectedGameTypes: string[],
    gameTypes: GenericType[] | null,
    newGameId: number
) {
    await deleteGameHasGameType(newGameId)

    for (const gameType of selectedGameTypes) {
        const gameTypeId = gameTypes?.find(gameTypeItem => gameTypeItem.name === gameType)?.id

        if (!gameTypeId) {
            console.error('Could not find game type:', gameType)
            throw new Error('Could not find game type.')
        }

        await createGameHasGameType(newGameId, gameTypeId)
    }
}
