import {
    createGame,
    createGameHasAccessory,
    createGameHasGameType,
} from '../services/gameService'
import { GameInsertDto, GameTranslationInsertDto } from '../types/gameDto'
import { GenericType } from '../types/genericType'
import { AdvancedSettings, NewGame, GameTranslations } from '../types/newGame'
import { createAccessory } from '../services/accessoryService'
import { removeGameOptionsLastFetched } from './storageUtils'
import { validNaturalNumber, validString } from './inputUtils'

/**
 * Creates a new game as well as the accessories and game types associated with it.
 * @param newGameData
 * @param advancedDefaultSettings
 * @param newGameTranslations
 */
export async function createNewGame(
    newGameData: NewGame,
    advancedDefaultSettings: AdvancedSettings,
    newGameTranslations: GameTranslations
) {
    // New Game
    const gameInsertDto: GameInsertDto = {
        id: newGameData.id,
        name: newGameData.name,
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

    newGameTranslationInsertDtos.push({
        id: newGameTranslations['en']?.id,
        language: 'en',
        name: newGameData.name,
        intro_description: validString(newGameData.introDescription),
        descriptions: getValidDescriptions(newGameData.descriptions),
        custom_end_game_sentence: validString(advancedDefaultSettings.customEndGameSentence),
        has_winner_prompt: validString(advancedDefaultSettings.hasWinnerPrompt),
    })

    Object.entries(newGameTranslations).forEach(([key, translation]) => {
        if (key === 'en') return

        newGameTranslationInsertDtos.push({
            id: translation.id,
            language: key,
            name: translation.name,
            intro_description: validString(translation.introDescription),
            descriptions: getValidDescriptions(translation.descriptions),
            custom_end_game_sentence: validString(translation.customEndGameSentence),
            has_winner_prompt: validString(translation.hasWinnerPrompt),
        })
    })

    return await createGame(gameInsertDto, newGameTranslationInsertDtos)
}

/**
 * Iterates through the selected accessories and adds them to the new game.
 * @param selectedAccessories
 * @param accessories
 * @param newGameId
 * @param newGameTranslations
 */
export async function addAccessoriesToGame(
    selectedAccessories: string[],
    accessories: GenericType[] | null,
    newGameId: number,
    newGameTranslations: GameTranslations
) {
    for (const accessory of selectedAccessories) {
        const index = selectedAccessories.indexOf(accessory)

        let accessoryId = accessories?.find(
            accessoryItem => accessoryItem.name === accessory
        )?.id

        // Create accessory if it does not exist.
        if (!accessoryId) {
            // New Game Translations
            const accessoryTranslations: { language: string; name: string }[] = [
                {
                    language: 'en',
                    name: accessory,
                },
            ]

            Object.entries(newGameTranslations).forEach(([key, translation]) => {
                if (key === 'en') return

                accessoryTranslations.push({
                    language: key,
                    name: translation.accessories?.[index] ?? accessory,
                })
            })

            const newAccessory = await createAccessory(accessoryTranslations)
            accessoryId = newAccessory?.id

            // Remove the last fetched game options to force a re-fetch.
            removeGameOptionsLastFetched()

            if (accessoryId) {
                await createGameHasAccessory(newGameId, accessoryId)
            }
        }
    }
}

/**
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
    for (const gameType of selectedGameTypes) {
        const gameTypeId = gameTypes?.find(gameTypeItem => gameTypeItem.name === gameType)?.id

        if (!gameTypeId) {
            console.error('Could not find game type:', gameType)
            throw new Error('Could not find game type.')
        }

        await createGameHasGameType(newGameId, gameTypeId)
    }
}

/**
 * Filters out empty descriptions.
 * @param descriptions
 */
export const getValidDescriptions = (descriptions: string[]): string[] => {
    return descriptions.filter(description => description !== '')
}
