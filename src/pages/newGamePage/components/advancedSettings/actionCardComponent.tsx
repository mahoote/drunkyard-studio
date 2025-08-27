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
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
} from '@mui/material'
import {
    handleNumberChange,
    handleSelectChange,
    handleTextChange,
} from '../../../../utils/inputUtils'
import TextFieldSuggestionsComponent from '../../../../components/textFieldSuggestionsComponent'
import { actionCardSuggestions } from '../../../../constants/WORD_SUGGESTION_DATA'
import ErrorMessageComponent from '../../../../components/errorMessageComponent'
import PageLoaderComponent from '../../../../components/pageLoaderComponent'
import { useNewGameStore } from '../../../../hooks/useNewGameStore'
import { useActionCardStore } from '../../../../hooks/useActionCardStore'
import ActionCardsInputComponent from '../../../../components/actionCardsInputComponent'

/**
 * All the different settings to add to a game with "Action Card" game type.
 * @constructor
 */
function ActionCardComponent() {
    const {
        actionCardState,
        actionCardTranslationsState,
        setActionCardDataState,
        setActionCardTranslationsState,
    } = useNewGameStore()

    const { actionCardStates, loading, error, fetchApi } = useActionCardStore()

    useEffect(() => {
        fetchApi()
    }, [fetchApi])

    if (!actionCardTranslationsState.en || !actionCardState) {
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

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
                                value={actionCardState.stateId}
                                onChange={event =>
                                    handleSelectChange(
                                        event,
                                        actionCardState,
                                        setActionCardDataState
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

                    <Grid item xs={12} sm="auto">
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
                                value={actionCardState.cardLimit}
                                onChange={event =>
                                    handleNumberChange(
                                        event,
                                        actionCardState,
                                        setActionCardDataState
                                    )
                                }
                                fullWidth
                                disabled={actionCardState.oneCardPerPlayer}
                            />
                        </Tooltip>
                    </Grid>

                    <Grid item>
                        <ToggleButtonGroup
                            color="primary"
                            value={actionCardState.allowSentence ? 'sentence' : 'word'}
                            exclusive
                            onChange={(_, value: string) => {
                                setActionCardDataState({
                                    ...actionCardState,
                                    allowSentence: value === 'sentence',
                                })
                            }}
                            aria-label="Platform"
                            sx={{ height: '100%' }}
                        >
                            <ToggleButton value="sentence">SENTENCE</ToggleButton>
                            <ToggleButton value="word">WORD</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>

                <Typography fontWeight="bold">Timer</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm="auto">
                        <Tooltip title={'How long each card is displayed.'}>
                            <TextField
                                label="Card Time (Seconds)"
                                variant="outlined"
                                name="cardSeconds"
                                type="number"
                                inputProps={{ min: 0 }}
                                value={actionCardState.cardSeconds}
                                onChange={event =>
                                    handleNumberChange(
                                        event,
                                        actionCardState,
                                        setActionCardDataState
                                    )
                                }
                                fullWidth
                            />
                        </Tooltip>
                    </Grid>
                    {(actionCardState?.cardSeconds ?? 0) > 0 && (
                        <Tooltip
                            title={
                                'If the "Card Seconds" is set, the Auto-next decides if there is a manual step between each card or if they should show the next card automatically.'
                            }
                        >
                            <FormControlLabel
                                control={
                                    <Switch
                                        defaultChecked={actionCardState.isAutoNext}
                                        onChange={event => {
                                            setActionCardDataState({
                                                ...actionCardState,
                                                isAutoNext: event.target.checked,
                                            })
                                        }}
                                    />
                                }
                                label="Auto-next"
                                labelPlacement="top"
                            />
                        </Tooltip>
                    )}
                </Grid>

                <Typography fontWeight="bold">Generic</Typography>
                <Grid container spacing={2}>
                    <Tooltip title={'If the action card can repeat and show up again.'}>
                        <FormControlLabel
                            control={
                                <Switch
                                    defaultChecked={actionCardState.canRepeat}
                                    onChange={event => {
                                        setActionCardDataState({
                                            ...actionCardState,
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
                            'If the players will be creative and make their custom action cards.'
                        }
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    defaultChecked={actionCardState.isPlayerCreative}
                                    onChange={event => {
                                        setActionCardDataState({
                                            ...actionCardState,
                                            isPlayerCreative: event.target.checked,
                                        })
                                    }}
                                />
                            }
                            label="Custom Prompts"
                            labelPlacement="top"
                        />
                    </Tooltip>
                </Grid>

                {[4, 5, 6].includes(actionCardState.stateId) && (
                    <>
                        <Typography fontWeight="bold">Players Without Cards</Typography>
                        <Grid container spacing={2}>
                            {actionCardState.stateId === 6 && (
                                <Grid item xs={12} sm={3}>
                                    <Tooltip
                                        title={
                                            <span>
                                                The amount of players not to receive cards.
                                                <br />
                                                Can be a number or fraction.
                                            </span>
                                        }
                                    >
                                        <TextField
                                            label="Player Amount Without Cards"
                                            variant="filled"
                                            name="excludePlayersAmount"
                                            value={actionCardState.excludePlayersAmount}
                                            onChange={event =>
                                                handleTextChange(
                                                    event,
                                                    actionCardState,
                                                    setActionCardDataState
                                                )
                                            }
                                            required
                                            fullWidth
                                        />
                                    </Tooltip>
                                </Grid>
                            )}
                            {actionCardState.stateId === 4 && (
                                <Tooltip
                                    title={
                                        'The limit of cards is automatically set to the amount of players'
                                    }
                                >
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                defaultChecked={
                                                    actionCardState.oneCardPerPlayer
                                                }
                                                onChange={event => {
                                                    setActionCardDataState({
                                                        ...actionCardState,
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
                            )}

                            <Tooltip
                                title={
                                    'The players not receiving cards will be given a buzzer for the game.'
                                }
                            >
                                <FormControlLabel
                                    control={
                                        <Switch
                                            defaultChecked={actionCardState.hasBuzzer}
                                            onChange={event => {
                                                setActionCardDataState({
                                                    ...actionCardState,
                                                    hasBuzzer: event.target.checked,
                                                })
                                            }}
                                        />
                                    }
                                    label="Buzzer"
                                    labelPlacement="top"
                                />
                            </Tooltip>
                        </Grid>
                    </>
                )}

                <Typography fontWeight="bold">Prompts</Typography>
                <Grid container spacing={2}>
                    {actionCardState.isPlayerCreative && (
                        <Grid item xs={12} sm={6}>
                            <Tooltip
                                title={
                                    'This prompt will show between games if the players have checked "Player Creativity". They will write sentences or words based on this prompt.'
                                }
                            >
                                <TextFieldSuggestionsComponent
                                    wordSuggestions={actionCardSuggestions}
                                    label='"Custom Prompts" Prompt'
                                    variant="filled"
                                    name="playerCreativePrompt"
                                    multiline
                                    fullWidth
                                    required
                                    value={
                                        actionCardTranslationsState.en?.playerCreativePrompt
                                    }
                                    setValue={newValue =>
                                        setActionCardTranslationsState({
                                            ...actionCardTranslationsState,
                                            en: {
                                                ...actionCardTranslationsState.en,
                                                playerCreativePrompt: newValue,
                                            },
                                        })
                                    }
                                />
                            </Tooltip>
                        </Grid>
                    )}
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
                                value={actionCardTranslationsState.en?.prompt}
                                setValue={newValue =>
                                    setActionCardTranslationsState({
                                        ...actionCardTranslationsState,
                                        en: {
                                            ...actionCardTranslationsState.en,
                                            prompt: newValue,
                                        },
                                    })
                                }
                            />
                        </Tooltip>
                    </Grid>
                </Grid>

                <Typography fontWeight="bold">Cards</Typography>
                <ActionCardsInputComponent />
            </Box>
        </>
    )
}

export default ActionCardComponent
