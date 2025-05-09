import React, { useState } from 'react'

import {
    Box,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material'
import { useNewGameStore } from '../../hooks/useNewGameStore'
import { useNavigate } from 'react-router-dom'

import PageLoaderComponent from '../../components/pageLoaderComponent'
import { ActiveGameType } from '../../types/gameDto'
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

    const [activeGamesValue, setActiveGamesValue] = useState<ActiveGameType>('custom')

    if (loading) {
        return <PageLoaderComponent />
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormControl>
                <InputLabel id="active-games-select-label">Active Games</InputLabel>
                <Select
                    labelId="active-games-select-label"
                    id="active-games-select"
                    label="Active Games"
                    value={activeGamesValue}
                    onChange={event =>
                        setActiveGamesValue(event.target.value as ActiveGameType)
                    }
                >
                    <MenuItem value="custom" disabled={false}>
                        Custom
                    </MenuItem>
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="none">None</MenuItem>
                </Select>
            </FormControl>
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
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Typography>
                                <Typography sx={{ color: 'text.secondary' }} component="span">
                                    ({game.id})
                                </Typography>{' '}
                                {game.name}
                            </Typography>
                            <Tooltip title="Active Game" placement="top">
                                <Switch
                                    aria-label={'Active Game'}
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
                        <Typography sx={{ color: 'text.secondary' }}>
                            {game.gameTranslation[0].descriptions[0]?.text}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    )
}
