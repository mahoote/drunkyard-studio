import React, { useEffect, useRef } from 'react'
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import {
    handleGameTranslationChange,
    handleNumberChange,
    handleSelectChange,
} from '../../../../utils/inputUtils'
import ChipsAutocompleteComponent from '../../../../components/chipsAutocompleteComponent'
import { getGameTypeCombinations } from '../../../../utils/gameTypeUtils'
import PreviewWindowComponent from './previewWindowComponent'
import { activityLevels, drunkLevels } from '../../../../constants/NEW_GAME_FORM_DATA'
import { GenericType } from '../../../../types/genericType'
import ErrorMessageComponent from '../../../../components/errorMessageComponent'
import PageLoaderComponent from '../../../../components/pageLoaderComponent'
import { useNewGameStore } from '../../../../hooks/useNewGameStore'
import { useGameOptionsStore } from '../../../../hooks/useGameOptionsStore'

function NewGameFormComponent() {
    const {
        newGame,
        setNewGame,
        setSelectedAccessories,
        selectedGameTypes,
        setSelectedGameTypes,
        activeFormRef,
        setActiveFormRef,
        setGameTranslations,
        gameTranslations,
    } = useNewGameStore()

    const { fetchApi, loading, error, gameCategories, gameTypes, accessories, gameAudience } =
        useGameOptionsStore()

    const gameName = gameTranslations.en.name

    // Set active form ref if it doesn't exist
    const formRef = useRef(null)
    if (!activeFormRef) {
        setActiveFormRef(formRef)
    }

    useEffect(() => {
        fetchApi()
    }, [fetchApi])

    if (error) {
        return (
            <ErrorMessageComponent message="There was a problem loading data from the database." />
        )
    }

    if (loading) {
        return <PageLoaderComponent />
    }

    return (
        <Grid container spacing={2} component="form" ref={activeFormRef}>
            <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Name"
                                variant="filled"
                                name="name"
                                value={gameName}
                                onChange={event =>
                                    handleGameTranslationChange(
                                        event,
                                        gameTranslations,
                                        setGameTranslations
                                    )
                                }
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel id="category-label">Category</InputLabel>
                                <Select
                                    labelId="category-label"
                                    label="Category"
                                    name="categoryId"
                                    value={newGame.categoryId}
                                    onChange={event =>
                                        handleSelectChange(event, newGame, setNewGame)
                                    }
                                    variant={'filled'}
                                >
                                    {gameCategories?.map((category: GenericType) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel id="activity-label">Activity Level</InputLabel>
                                <Select
                                    labelId="activity-label"
                                    label="Activity Level"
                                    name="activityLevel"
                                    value={newGame.activityLevel}
                                    onChange={event =>
                                        handleSelectChange(event, newGame, setNewGame)
                                    }
                                    variant={'filled'}
                                >
                                    {activityLevels.map(level => (
                                        <MenuItem key={level.id} value={level.id}>
                                            {level.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel id="drunk-label">Drunk Level</InputLabel>
                                <Select
                                    labelId="drunk-label"
                                    label="Drunk Level"
                                    name="drunkLevel"
                                    value={newGame.drunkLevel}
                                    onChange={event =>
                                        handleSelectChange(event, newGame, setNewGame)
                                    }
                                    variant={'filled'}
                                >
                                    {drunkLevels.map(level => (
                                        <MenuItem key={level.id} value={level.id}>
                                            {level.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Minimum Players"
                                variant="outlined"
                                name="minPlayers"
                                type="number"
                                inputProps={{ min: 2 }}
                                value={newGame.minPlayers}
                                onChange={event =>
                                    handleNumberChange(event, newGame, setNewGame)
                                }
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Maximum Players"
                                variant="outlined"
                                name="maxPlayers"
                                type="number"
                                inputProps={{ min: 0 }}
                                value={newGame.maxPlayers}
                                onChange={event =>
                                    handleNumberChange(event, newGame, setNewGame)
                                }
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Minutes"
                                variant="filled"
                                name="minutes"
                                type="number"
                                inputProps={{ min: 0 }}
                                value={newGame.minutes}
                                onChange={event =>
                                    handleNumberChange(event, newGame, setNewGame)
                                }
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <ChipsAutocompleteComponent
                                predefinedValues={
                                    gameTypes?.map(gameType => gameType.name) ?? []
                                }
                                selectedValues={selectedGameTypes}
                                setSelectedValues={setSelectedGameTypes}
                                label="Game Types"
                                optionCombinations={getGameTypeCombinations()}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel id="game-audience-label">Game Audience</InputLabel>
                                <Select
                                    variant={'outlined'}
                                    labelId="game-audience-label"
                                    label="Game Audience"
                                    name="gameAudienceId"
                                    value={newGame.gameAudienceId}
                                    onChange={event =>
                                        handleSelectChange(event, newGame, setNewGame)
                                    }
                                >
                                    <MenuItem value={0}>
                                        <em>None</em>
                                    </MenuItem>
                                    {gameAudience?.map(audience => (
                                        <MenuItem key={audience.id} value={audience.id}>
                                            {audience.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <ChipsAutocompleteComponent
                        predefinedValues={accessories?.map(accessory => accessory.name) ?? []}
                        selectedValues={gameTranslations.en.accessories ?? []}
                        setSelectedValues={setSelectedAccessories}
                        label="Accessories"
                        freeSolo={true}
                    />
                </Box>
            </Grid>
            <Grid item xs={12} md={6}>
                <PreviewWindowComponent />
            </Grid>
        </Grid>
    )
}

export default NewGameFormComponent
