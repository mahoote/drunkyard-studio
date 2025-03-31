import React, { useEffect } from 'react'
import {
    Box,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import {
    handleNumberChange,
    handleSelectChange,
    handleTextChange,
} from '../../../../utils/inputUtils'
import MultiInputComponent from '../../../../components/multiInput/multiInputComponent'
import TextFieldSuggestionsComponent from '../../../../components/textFieldSuggestionsComponent'
import { actionCardSuggestions } from '../../../../constants/WORD_SUGGESTION_DATA'
import ErrorMessageComponent from '../../../../components/errorMessageComponent'
import PageLoaderComponent from '../../../../components/pageLoaderComponent'
import { useNewGameStore } from '../../../../hooks/useNewGameStore'
import { useActionCardStore } from '../../../../hooks/useActionCardStore'

/**
 * All the different settings to add to a game with "Action Card" game type.
 * @constructor
 */
function ActionCardSettingsComponent() {
    const {
        actionCardSettingsData,
        setActionCardSettingsData,
        actionCardInputs,
        setActionCardInputs,
    } = useNewGameStore()

    const { actionCardStates, loading, error, fetchApi } = useActionCardStore()

    useEffect(() => {
        fetchApi()
    }, [fetchApi])

    if (!actionCardInputs || !actionCardSettingsData) {
        return (
            <>
                <Box my={3}>
                    <Divider />
                </Box>
                <ErrorMessageComponent message="Could not load the Action Card settings" />
            </>
        )
    }

    if (error) {
        return (
            <ErrorMessageComponent message="There was a problem loading Action Card data from the database" />
        )
    }

    if (loading) return <PageLoaderComponent />

    return (
        <>
            <Box my={3}>
                <Divider />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6">Action Card Settings</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel id="state">State</InputLabel>
                            <Select
                                variant="filled"
                                labelId="state-id"
                                label="State"
                                name="stateId"
                                value={actionCardSettingsData.stateId}
                                onChange={event =>
                                    handleSelectChange(
                                        event,
                                        actionCardSettingsData,
                                        setActionCardSettingsData
                                    )
                                }
                            >
                                {actionCardStates?.map(state => (
                                    <MenuItem key={state.id} value={state.id}>
                                        {state.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    {actionCardSettingsData.stateId === 6 && (
                        <Grid item xs={12} sm={2}>
                            <Tooltip title={'The amount of players not to receive cards.'}>
                                <TextField
                                    label="Exclude Players Amount"
                                    variant="filled"
                                    name="excludePlayersAmount"
                                    value={actionCardSettingsData.excludePlayersAmount}
                                    onChange={event =>
                                        handleTextChange(
                                            event,
                                            actionCardSettingsData,
                                            setActionCardSettingsData
                                        )
                                    }
                                    required
                                    fullWidth
                                />
                            </Tooltip>
                        </Grid>
                    )}

                    <Grid item xs={12} sm={actionCardSettingsData.stateId === 6 ? 2 : 3}>
                        <Tooltip
                            title={
                                'How many cards there is in a game. Will end the game after the last card.'
                            }
                        >
                            <TextField
                                label="Card Limit"
                                variant="outlined"
                                name="cardLimit"
                                type="number"
                                inputProps={{ min: 0 }}
                                value={actionCardSettingsData.cardLimit}
                                onChange={event =>
                                    handleNumberChange(
                                        event,
                                        actionCardSettingsData,
                                        setActionCardSettingsData
                                    )
                                }
                                fullWidth
                                disabled={actionCardSettingsData.oneCardPerPlayer}
                            />
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} sm={actionCardSettingsData.stateId === 6 ? 2 : 3}>
                        <Tooltip title={'How long each card is displayed.'}>
                            <TextField
                                label="Card Time (Seconds)"
                                variant="outlined"
                                name="cardSeconds"
                                type="number"
                                inputProps={{ min: 0 }}
                                value={actionCardSettingsData.cardSeconds}
                                onChange={event =>
                                    handleNumberChange(
                                        event,
                                        actionCardSettingsData,
                                        setActionCardSettingsData
                                    )
                                }
                                fullWidth
                            />
                        </Tooltip>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Tooltip
                            title={
                                'The common prompt at the beginning of the card. Can be used to give a hint, a question or a statement.'
                            }
                        >
                            <TextFieldSuggestionsComponent
                                wordSuggestions={actionCardSuggestions}
                                label="Action Card Prompt"
                                variant="outlined"
                                name="prompt"
                                fullWidth
                                value={actionCardSettingsData.prompt}
                                setValue={newValue =>
                                    setActionCardSettingsData({
                                        ...actionCardSettingsData,
                                        prompt: newValue,
                                    })
                                }
                            />
                        </Tooltip>
                    </Grid>
                    {actionCardSettingsData.isPlayerCreative && (
                        <Grid item xs={12} sm={6}>
                            <Tooltip
                                title={
                                    'This prompt will show between games if the players have checked "Player Creativity". They will write sentences or words based on this prompt.'
                                }
                            >
                                <TextFieldSuggestionsComponent
                                    wordSuggestions={actionCardSuggestions}
                                    label="Player Creative Prompt"
                                    variant="filled"
                                    name="playerCreativePrompt"
                                    multiline
                                    fullWidth
                                    required
                                    value={actionCardSettingsData.playerCreativePrompt}
                                    setValue={newValue =>
                                        setActionCardSettingsData({
                                            ...actionCardSettingsData,
                                            playerCreativePrompt: newValue,
                                        })
                                    }
                                />
                            </Tooltip>
                        </Grid>
                    )}
                </Grid>
                <Grid container>
                    <Grid item xs={12}>
                        <Box display="flex" flexWrap="wrap">
                            <Tooltip title="When false, only allow a single word in the action card.">
                                <FormControlLabel
                                    control={
                                        <Switch
                                            defaultChecked={
                                                actionCardSettingsData.allowSentence
                                            }
                                            onChange={event => {
                                                setActionCardSettingsData({
                                                    ...actionCardSettingsData,
                                                    allowSentence: event.target.checked,
                                                })
                                            }}
                                        />
                                    }
                                    label="Allow Sentence"
                                    labelPlacement="top"
                                />
                            </Tooltip>
                            <Tooltip
                                title={
                                    'If the "Card Seconds" is set, the Auto-next decides if there is a manual step between each card or if they should show the next card automatically.'
                                }
                            >
                                <FormControlLabel
                                    disabled={(actionCardSettingsData?.cardSeconds ?? 0) <= 0}
                                    control={
                                        <Switch
                                            defaultChecked={actionCardSettingsData.isAutoNext}
                                            onChange={event => {
                                                setActionCardSettingsData({
                                                    ...actionCardSettingsData,
                                                    isAutoNext: event.target.checked,
                                                })
                                            }}
                                        />
                                    }
                                    label="Auto-next"
                                    labelPlacement="top"
                                />
                            </Tooltip>
                            <Tooltip
                                title={
                                    'If there are players not receiving cards, they will be given a buzzer for the game.'
                                }
                            >
                                <FormControlLabel
                                    disabled={
                                        ![4, 5, 6].includes(actionCardSettingsData.stateId)
                                    }
                                    control={
                                        <Switch
                                            defaultChecked={actionCardSettingsData.hasBuzzer}
                                            onChange={event => {
                                                setActionCardSettingsData({
                                                    ...actionCardSettingsData,
                                                    hasBuzzer: event.target.checked,
                                                })
                                            }}
                                        />
                                    }
                                    label="Buzzer"
                                    labelPlacement="top"
                                />
                            </Tooltip>
                            <Tooltip
                                title={
                                    'If the players will be creative and make their own cards.'
                                }
                            >
                                <FormControlLabel
                                    control={
                                        <Switch
                                            defaultChecked={
                                                actionCardSettingsData.isPlayerCreative
                                            }
                                            onChange={event => {
                                                setActionCardSettingsData({
                                                    ...actionCardSettingsData,
                                                    isPlayerCreative: event.target.checked,
                                                })
                                            }}
                                        />
                                    }
                                    label="Player Creative"
                                    labelPlacement="top"
                                />
                            </Tooltip>
                            <Tooltip
                                title={'If the action card can repeat and show up again.'}
                            >
                                <FormControlLabel
                                    control={
                                        <Switch
                                            defaultChecked={actionCardSettingsData.canRepeat}
                                            onChange={event => {
                                                setActionCardSettingsData({
                                                    ...actionCardSettingsData,
                                                    canRepeat: event.target.checked,
                                                })
                                            }}
                                        />
                                    }
                                    label="Can Repeat"
                                    labelPlacement="top"
                                />
                            </Tooltip>
                            <Tooltip
                                title={
                                    'Instead of the global game timer, it will use timer per card.'
                                }
                            >
                                <FormControlLabel
                                    control={
                                        <Switch
                                            defaultChecked={
                                                actionCardSettingsData.cardBasedTimer
                                            }
                                            onChange={event => {
                                                setActionCardSettingsData({
                                                    ...actionCardSettingsData,
                                                    cardBasedTimer: event.target.checked,
                                                })
                                            }}
                                        />
                                    }
                                    label="Card Based Timer"
                                    labelPlacement="top"
                                />
                            </Tooltip>
                            <Tooltip
                                title={
                                    'The limit of cards is automatically set to the amount of players'
                                }
                            >
                                <FormControlLabel
                                    disabled={actionCardSettingsData.stateId !== 4}
                                    control={
                                        <Switch
                                            defaultChecked={
                                                actionCardSettingsData.oneCardPerPlayer
                                            }
                                            onChange={event => {
                                                setActionCardSettingsData({
                                                    ...actionCardSettingsData,
                                                    oneCardPerPlayer: event.target.checked,
                                                    cardLimit: 0,
                                                })
                                            }}
                                        />
                                    }
                                    label="One Card Per Player"
                                    labelPlacement="top"
                                />
                            </Tooltip>
                        </Box>
                    </Grid>
                </Grid>
                <Typography>Cards</Typography>
                <MultiInputComponent
                    wordSuggestions={actionCardSuggestions}
                    multiline={actionCardSettingsData.allowSentence}
                    inputs={actionCardInputs}
                    setInputs={setActionCardInputs}
                    variant="filled"
                />
            </Box>
        </>
    )
}

export default ActionCardSettingsComponent
