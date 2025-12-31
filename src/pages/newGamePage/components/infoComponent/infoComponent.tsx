import React, { useEffect, useRef } from 'react'
import {
    Grid,
    TextField,
    Divider,
    Box,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
} from '@mui/material'
import { handleNumberChange, handleSelectChange } from '../../../../utils/inputUtils.tsx'
import { GenericType } from '../../../../types/genericType.ts'
import { useNewGameStore } from '../../../../hooks/useNewGameStore.ts'
import { useGameOptionsStore } from '../../../../hooks/useGameOptionsStore.ts'
import ErrorMessageComponent from '../../../../components/errorMessageComponent.tsx'
import PageLoaderComponent from '../../../../components/pageLoaderComponent.tsx'
import { activityLevels, drunkLevels } from '../../../../constants/NEW_GAME_FORM_DATA.ts'

const InfoComponent = () => {
    const { newGame, setNewGame, activeFormRef, setActiveFormRef } = useNewGameStore()

    const { fetchApi, loading, error, gameCategories } = useGameOptionsStore()

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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
                <h3>Required</h3>
                <TextField label="Game Name" variant="filled" name="name" fullWidth />
            </Box>
            <Divider />
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Minutes"
                        variant="filled"
                        name="minutes"
                        type="number"
                        inputProps={{ min: 0 }}
                        value={newGame.minutes}
                        onChange={event => handleNumberChange(event, newGame, setNewGame)}
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
                            onChange={event => handleSelectChange(event, newGame, setNewGame)}
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
                            onChange={event => handleSelectChange(event, newGame, setNewGame)}
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
                            onChange={event => handleSelectChange(event, newGame, setNewGame)}
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
        </Box>
    )
}

export default InfoComponent
