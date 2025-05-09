import React from 'react'

import { Box, Card, CardContent, Switch, Tooltip, Typography, useTheme } from '@mui/material'
import { useNewGameStore } from '../../hooks/useNewGameStore'
import { useNavigate } from 'react-router-dom'

import PageLoaderComponent from '../../components/pageLoaderComponent'
import { handleSelectGame, handleSetGameActive } from '../../utils/editGameUtils'
import { useEditGameLogic } from '../../hooks/useEditGameLogic'
import { useStudioStore } from '../../hooks/useStudioStore'

export default function EditGamePage() {
    const theme = useTheme()
    const navigate = useNavigate()

    const {
        resetStore,
        setNewGame,
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

    const { setStudioAlert } = useStudioStore()

    const { games, loading, setLoading } = useEditGameLogic()

    if (loading) {
        return <PageLoaderComponent />
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box
                sx={{
                    padding: 2,
                    paddingBottom: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography sx={{ fontWeight: 'bold' }}>
                    <Typography
                        sx={{ color: 'text.secondary', fontWeight: 'bold' }}
                        component="span"
                    >
                        (id)
                    </Typography>{' '}
                    Name
                </Typography>
                <Typography sx={{ fontWeight: 'bold' }}>Is Active</Typography>
            </Box>
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
                    onClick={() =>
                        void handleSelectGame(
                            game.id,
                            setLoading,
                            resetStore,
                            setNewGame,
                            setSelectedGameTypes,
                            setSelectedAccessories,
                            setAdvancedSettingsData,
                            setActionCardSettingsData,
                            setActionCards,
                            setGameTranslations,
                            setFormStepIndex,
                            navigate,
                            setActionCardSettingsTranslations,
                            setActionCardTranslations
                        )
                    }
                >
                    <CardContent>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <Box>
                                <Typography>
                                    <Typography
                                        sx={{ color: 'text.secondary' }}
                                        component="span"
                                    >
                                        ({game.id})
                                    </Typography>{' '}
                                    {game.name}
                                </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>
                                    {game.gameTranslation[0].descriptions[0]?.text}
                                </Typography>
                            </Box>
                            <Box>
                                <Tooltip title="Is Active" placement="top">
                                    <Switch
                                        aria-label={'Is Active'}
                                        onClick={event => event.stopPropagation()}
                                        onChange={event =>
                                            void handleSetGameActive(
                                                event,
                                                setStudioAlert,
                                                game.id
                                            )
                                        }
                                        defaultChecked={game.active}
                                    />
                                </Tooltip>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Box>
    )
}
