import React, { useEffect, useState } from 'react'
import { getPreviewGamesByPage } from '../../services/gameService'
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material'
import { GamePreview } from '../../types/gameDto'

export default function EditGamePage() {
    const theme = useTheme()

    const [games, setGames] = useState<GamePreview[]>([])

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
