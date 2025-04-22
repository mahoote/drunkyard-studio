import React, { useEffect, useState } from 'react'
import {
    getGame,
    getGameTranslations,
    getPreviewGamesByPage,
} from '../../services/gameService'
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material'
import { useNewGameStore } from '../../hooks/useNewGameStore'
import { useNavigate } from 'react-router-dom'
import {
    getActionCards,
    getActionCardSettings,
    getActionCardSettingsTranslations,
} from '../../services/actionCardService'
import { GameTranslations } from '../../types/newGame'
import PageLoaderComponent from '../../components/pageLoaderComponent'
import { GamePreviewResponse } from '../../types/gameResponse'
import { ActionCardSettingsTranslations } from '../../types/actionCard'

export default function EditGamePage() {
    const theme = useTheme()
    const navigate = useNavigate()

    const {
        resetStore,
        setNewGame,
        setDescriptions,
        setAdvancedSettingsData,
        setActionCardSettingsData,
        setSelectedGameTypes,
        setSelectedAccessories,
        setActionCards,
        setGameTranslations,
        setFormStepIndex,
        setActionCardSettingsTranslations,
        setActionCardTranslations,
    } = useNewGameStore()

    const [games, setGames] = useState<GamePreviewResponse[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const handleSelectGame = async (gameId: number) => {
        setLoading(true)

        resetStore()

        try {
            const game = await getGame(gameId)
            const gameTranslations = await getGameTranslations(gameId)
            const actionCardSettings = await getActionCardSettings(gameId)

            if (!game || !gameTranslations) {
                console.error(new Error('Error getting game details'))
                setLoading(false)
                return
            }

            const newGameTranslations: GameTranslations = {}

            const englishGameTranslation = gameTranslations.find(
                translation => translation.language === 'en'
            )

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
                    customEndGameSentence: translation.custom_end_game_sentence,
                    hasWinnerPrompt: translation.has_winner_prompt,
                }
            })

            setGameTranslations(newGameTranslations)

            if (actionCardSettings) {
                const actionCardSettingsTranslations = await getActionCardSettingsTranslations(
                    actionCardSettings.id
                )
                const actionCardsMap = await getActionCards(actionCardSettings.id)

                if (!actionCardSettingsTranslations) {
                    console.error(new Error('Error getting action card settings translations'))
                    setLoading(false)
                    return
                }

                setActionCardSettingsData({
                    id: actionCardSettings.id,
                    stateId: actionCardSettings.state_id,
                    cardLimit: actionCardSettings.card_limit,
                    cardSeconds: actionCardSettings.card_seconds,
                    isAutoNext: actionCardSettings.is_auto_next,
                    isPlayerCreative: actionCardSettings.is_player_creative,
                    hasBuzzer: actionCardSettings.has_buzzer,
                    allowSentence: actionCardSettings.allow_sentence,
                    canRepeat: actionCardSettings.can_repeat,
                    excludePlayersAmount: actionCardSettings.exclude_players_amount,
                    cardBasedTimer: actionCardSettings.card_based_timer,
                    oneCardPerPlayer: actionCardSettings.one_card_per_player,
                })

                const newSettingsTranslations: ActionCardSettingsTranslations = {}

                actionCardSettingsTranslations.forEach(translation => {
                    newSettingsTranslations[translation.language] = {
                        prompt: translation?.prompt,
                        playerCreativePrompt: translation?.player_creative_prompt,
                    }
                })

                setActionCardSettingsTranslations(newSettingsTranslations)

                if (actionCardsMap) {
                    setActionCards(actionCardsMap['en'])
                    setActionCardTranslations(actionCardsMap)
                }
            }

            setFormStepIndex(0)
            navigate('/')
            setLoading(false)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchGames = async () => {
            setLoading(true)

            const games = await getPreviewGamesByPage(0, 100)
            setGames(games)

            setLoading(false)
        }

        void fetchGames()
    }, [])

    if (loading) {
        return <PageLoaderComponent />
    }

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
                        <Typography>
                            <Typography sx={{ color: 'text.secondary' }} component="span">
                                ({game.id})
                            </Typography>{' '}
                            {game.name}
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>
                            {game.game_translation[0].descriptions[0]?.text}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    )
}
