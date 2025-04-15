import React, { useEffect, useState } from 'react'
import { getGame, getPreviewGamesByPage } from '../../services/gameService'
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material'
import { GamePreview } from '../../types/gameDto'
import { useNewGameStore } from '../../hooks/useNewGameStore'
import { useNavigate } from 'react-router-dom'

export default function EditGamePage() {
    const theme = useTheme()
    const navigate = useNavigate()

    const { setNewGame } = useNewGameStore()

    const [games, setGames] = useState<GamePreview[]>([])

    const handleSelectGame = async (gameId: number) => {
        const game = await getGame(gameId)

        if (!game) {
            console.error(new Error('Game not found'))
            return
        }

        setNewGame({
            name: game.name,
            gameAudienceId: game.game_audience_id,
            activityLevel: game.activity_level,
            categoryId: game.game_category_id,
            drunkLevel: game.drunk_level,
            maxPlayers: game.max_players,
            minPlayers: game.min_players,
            minutes: game.minutes,
            descriptions: [],
        })

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
