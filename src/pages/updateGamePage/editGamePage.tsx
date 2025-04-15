import React, { useEffect, useState } from 'react'
import {
    getGame,
    getGameTranslations,
    getPreviewGamesByPage,
} from '../../services/gameService'
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material'
import { GamePreview } from '../../types/gameDto'
import { useNewGameStore } from '../../hooks/useNewGameStore'
import { useNavigate } from 'react-router-dom'
import {
    getActionCards,
    getActionCardSettings,
    getActionCardSettingsTranslations,
} from '../../services/actionCardService'
import { NewGameTranslations } from '../../types/newGame'

export default function EditGamePage() {
    const theme = useTheme()
    const navigate = useNavigate()

    const {
        setNewGame,
        setDescriptions,
        setAdvancedSettingsData,
        setActionCardSettingsData,
        setSelectedGameTypes,
        setSelectedAccessories,
        setActionCardInputs,
        setNewGameTranslations,
        setFormStepIndex,
    } = useNewGameStore()

    const [games, setGames] = useState<GamePreview[]>([])

    const handleSelectGame = async (gameId: number) => {
        const game = await getGame(gameId)
        const gameTranslations = await getGameTranslations(gameId)
        const actionCardSettings = await getActionCardSettings(gameId)

        if (!game || !gameTranslations) {
            console.error(new Error('Error getting game details'))
            return
        }

        const newGameTranslations: NewGameTranslations = {}

        const englishGameTranslation = gameTranslations.find(
            translation => translation.language === 'en'
        )

        setNewGame({
            id: game.id,
            name: game.name,
            gameAudienceId: game.game_audience_id,
            activityLevel: game.activity_level,
            categoryId: game.game_category_id,
            drunkLevel: game.drunk_level,
            maxPlayers: game.max_players,
            minPlayers: game.min_players,
            minutes: game.minutes,
            descriptions: [],
            introDescription: englishGameTranslation?.intro_description,
        })

        setDescriptions(englishGameTranslation?.descriptions ?? [])

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
            hasWinnerPrompt: englishGameTranslation?.has_winner_prompt,
            hasWinner: game.has_winner,
            customEndGameSentence: englishGameTranslation?.custom_end_game_sentence,
            gameEndType: game.game_end_type ?? '',
        })

        gameTranslations.forEach(translation => {
            newGameTranslations[translation.language] = {
                name: translation.name,
                introDescription: translation.intro_description,
                descriptions: translation.descriptions,
                accessories: game.accessories.flatMap(
                    accessory =>
                        accessory.accessory?.accessory_translation
                            ?.filter(t => t.language === translation.language)
                            .map(t => t.name) ?? []
                ),
                customEndGameSentence: translation.custom_end_game_sentence,
                hasWinnerPrompt: translation.has_winner_prompt,
            }
        })

        if (actionCardSettings) {
            const actionCardSettingsTranslations = await getActionCardSettingsTranslations(
                actionCardSettings.id
            )
            const actionCardsMap = await getActionCards(actionCardSettings.id)

            if (!actionCardSettingsTranslations || !actionCardsMap) {
                return
            }

            const englishActionCardSettingsTranslation = actionCardSettingsTranslations.find(
                translation => translation.language === 'en'
            )

            setActionCardSettingsData({
                stateId: actionCardSettings.state_id,
                cardLimit: actionCardSettings.card_limit,
                cardSeconds: actionCardSettings.card_seconds,
                isAutoNext: actionCardSettings.is_auto_next,
                prompt: englishActionCardSettingsTranslation?.prompt,
                isPlayerCreative: actionCardSettings.is_player_creative,
                playerCreativePrompt:
                    englishActionCardSettingsTranslation?.player_creative_prompt,
                hasBuzzer: actionCardSettings.has_buzzer,
                allowSentence: actionCardSettings.allow_sentence,
                canRepeat: actionCardSettings.can_repeat,
                excludePlayersAmount: actionCardSettings.exclude_players_amount,
                cardBasedTimer: actionCardSettings.card_based_timer,
                oneCardPerPlayer: actionCardSettings.one_card_per_player,
            })

            setActionCardInputs(actionCardsMap.get('en'))

            actionCardSettingsTranslations.forEach(translation => {
                newGameTranslations[translation.language] = {
                    ...newGameTranslations[translation.language],
                    prompt: translation?.prompt,
                    playerCreativePrompt: translation?.player_creative_prompt,
                    actionCardInputs: actionCardsMap.get(translation.language),
                }
            })
        }

        setNewGameTranslations(newGameTranslations)

        setFormStepIndex(0)
        navigate('/')
    }

    useEffect(() => {
        const fetchGames = async () => {
            const games = await getPreviewGamesByPage(0, 100)
            setGames(games)
        }

        fetchGames()
    }, [])

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {games.map((game, index) => (
                <Card
                    key={index}
                    sx={{
                        transition: '0.2s',
                        '&:hover': {
                            backgroundColor: theme.palette.grey[900],
                            cursor: 'pointer',
                        },
                    }}
                    onClick={() => void handleSelectGame(game.id)}
                >
                    <CardContent>
                        <Typography>{game.name}</Typography>
                        <Typography sx={{ color: 'text.secondary' }}>
                            {game.game_translation[0].intro_description}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    )
}
