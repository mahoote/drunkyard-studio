import { getGame, getGameTranslations, setGameActive } from '../services/gameService'
import { getActionCard, getActionCardTranslations } from '../services/actionCardService'
import { AdvancedSettings, GameTranslations, NewGame } from '../types/newGame'
import { ActionCard, ActionCardTranslations } from '../types/actionCard'
import { NavigateFunction } from 'react-router-dom'
import React from 'react'
import { GameLanguage } from '../types/language'
import { AppStudioAlert } from '../types/studio'

/**
 * Handle the selection of a game.
 * @param gameId
 * @param setLoading
 * @param resetStore
 * @param setNewGame
 * @param setSelectedGameTypes
 * @param setSelectedAccessories
 * @param setAdvancedSettingsData
 * @param setActionCardState
 * @param setGameTranslations
 * @param setFormStepIndex
 * @param navigate
 * @param setActionCardTranslations
 */
export async function handleSelectGame(
    gameId: number,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    resetStore: () => void,
    setNewGame: (game: NewGame) => void,
    setSelectedGameTypes: (gameTypes: string[]) => void,
    setSelectedAccessories: (accessories: string[], language?: GameLanguage) => void,
    setAdvancedSettingsData: (settings: AdvancedSettings) => void,
    setActionCardState: (settings: ActionCard | undefined) => void,
    setGameTranslations: (translations: GameTranslations) => void,
    setFormStepIndex: (step: number) => void,
    navigate: NavigateFunction,
    setActionCardTranslations: (translations: ActionCardTranslations) => void
) {
    setLoading(true)
    resetStore()

    try {
        const game = await getGame(gameId)
        const gameTranslations = await getGameTranslations(gameId)
        const actionCard = await getActionCard(gameId)

        if (!game || !gameTranslations) {
            console.error(new Error('Error getting game details'))
            setLoading(false)
            return
        }

        const newGameTranslations: GameTranslations = {}

        setNewGame({
            id: game.id,
            gameAudienceId: game.game_audience_id,
            activityLevel: game.activity_level,
            categoryId: game.game_category_id,
            drunkLevel: game.drunk_level,
            maxPlayers: game.max_players,
            minPlayers: game.min_players,
            minutes: game.minutes,
        })

        setSelectedGameTypes(
            game.game_types
                .map(gameType => gameType.game_type?.name)
                .filter((name): name is string => typeof name === 'string')
        )

        setSelectedAccessories(
            game.accessories.flatMap(
                accessory =>
                    accessory.accessory?.accessory_translation
                        ?.filter(t => t.language === 'en')
                        .map(t => t.name) ?? []
            )
        )

        setAdvancedSettingsData({
            hasWinner: game.has_winner,
            gameEndType: game.game_end_type ?? '',
        })

        gameTranslations.forEach(translation => {
            newGameTranslations[translation.language] = {
                id: translation.id,
                name: translation.name,
                descriptions: translation.descriptions,
                accessories: game.accessories.flatMap(
                    accessory =>
                        accessory.accessory?.accessory_translation
                            ?.filter(t => t.language === translation.language)
                            .map(t => t.name) ?? []
                ),
                hasWinnerPrompt: translation.has_winner_prompt,
            }
        })

        setGameTranslations(newGameTranslations)

        if (actionCard) {
            const actionCardTranslations = await getActionCardTranslations(actionCard.id)

            if (!actionCardTranslations) {
                console.error(new Error('Error getting action card settings translations'))
                setLoading(false)
                return
            }

            setActionCardState({
                id: actionCard.id,
                stateId: actionCard.state_id,
                cardLimit: actionCard.card_limit,
                cardSeconds: actionCard.card_seconds,
                isAutoNext: actionCard.is_auto_next,
                isPlayerCreative: actionCard.is_player_creative,
                hasBuzzer: actionCard.has_buzzer,
                allowSentence: actionCard.allow_sentence,
                canRepeat: actionCard.can_repeat,
                excludePlayersAmount: actionCard.exclude_players_amount,
                oneCardPerPlayer: actionCard.one_card_per_player,
            })

            const newTranslations: ActionCardTranslations = {}

            actionCardTranslations.forEach(translation => {
                newTranslations[translation.language] = {
                    id: translation.id,
                    prompt: translation.prompt,
                    playerCreativePrompt: translation.player_creative_prompt,
                    texts: translation.texts,
                }
            })

            setActionCardTranslations(newTranslations)
        }

        setFormStepIndex(0)
        navigate('/')
        setLoading(false)
    } catch (error) {
        console.error(error)
        setLoading(false)
    }
}

/**
 * Handle the click event for setting a game as active or inactive.
 * @param event
 * @param setStudioAlert
 * @param gameId
 */
export async function handleSetGameActive(
    event: React.ChangeEvent<HTMLInputElement>,
    setStudioAlert: (alert: AppStudioAlert) => void,
    gameId: number
) {
    const isChecked = event.target.checked

    try {
        await setGameActive(gameId, isChecked)
    } catch (error) {
        console.error(error)
        setStudioAlert({
            open: true,
            message: 'Failed to update active state. Please try again.',
            severity: 'error',
            autoHideDuration: 5000,
        })
    }
}
