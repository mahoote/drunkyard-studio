import React from 'react'
import {
    Box,
    Divider,
    FormControlLabel,
    Grid,
    Switch,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
} from '@mui/material'
import { handleNumberChange, handleTextChange } from '../../../../utils/inputUtils'
import TextFieldSuggestionsComponent from '../../../../components/textFieldSuggestionsComponent'
import { actionCardSuggestions } from '../../../../constants/WORD_SUGGESTION_DATA'
import ErrorMessageComponent from '../../../../components/errorMessageComponent'
import { useNewGameStore } from '../../../../hooks/useNewGameStore'
import ActionCardsInputComponent from '../../../../components/actionCardsInputComponent'
import ActionCardPreviewComponent from './actionCardPreviewComponent'

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

    return (
        <>
            <Box my={3}>
                <Divider />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Typography variant="h6">Action Card Settings</Typography>

                <Typography fontWeight="bold">Players Receiving Card</Typography>
                <Grid container spacing={2}>
                    <Grid item>
                        <ToggleButtonGroup
                            color="primary"
                            exclusive
                            aria-label="Platform"
                            sx={{ height: '100%' }}
                            value={actionCardState.includedPlayersToggle}
                            onChange={(_, value: string | null) =>
                                setActionCardDataState({
                                    ...actionCardState,
                                    includedPlayersToggle: value ?? undefined,
                                })
                            }
                        >
                            <ToggleButton value="1/1">ALL</ToggleButton>
                            <ToggleButton value="host">HOST</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                    <Grid item xs={12} sm="auto">
                        <Tooltip title="Number or fraction.">
                            <TextField
                                label="Player Amount"
                                variant="outlined"
                                name="includedPlayersAmount"
                                type="text"
                                value={actionCardState.includedPlayersAmount}
                                onChange={event =>
                                    handleTextChange(
                                        event,
                                        actionCardState,
                                        setActionCardDataState
                                    )
                                }
                                fullWidth
                                disabled={!!actionCardState.includedPlayersToggle}
                            />
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <FormControlLabel
                            control={
                                <Switch
                                    defaultChecked={actionCardState.shareCard}
                                    onChange={event => {
                                        setActionCardDataState({
                                            ...actionCardState,
                                            shareCard: event.target.checked,
                                        })
                                    }}
                                />
                            }
                            label="Shared Card"
                            labelPlacement="top"
                        />
                    </Grid>
                </Grid>
                <Divider />

                <Typography fontWeight="bold">Players With Unique Card</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm="auto">
                        <Tooltip title="Number or fraction.">
                            <TextField
                                label="Player Amount"
                                variant="outlined"
                                name="uniquePlayers"
                                type="text"
                                value={actionCardState.uniquePlayers}
                                onChange={event =>
                                    handleTextChange(
                                        event,
                                        actionCardState,
                                        setActionCardDataState
                                    )
                                }
                                fullWidth
                            />
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <FormControlLabel
                            control={
                                <Switch
                                    defaultChecked={actionCardState.shareUniqueCard}
                                    onChange={event => {
                                        setActionCardDataState({
                                            ...actionCardState,
                                            shareUniqueCard: event.target.checked,
                                        })
                                    }}
                                />
                            }
                            label="Shared Card"
                            labelPlacement="top"
                        />
                    </Grid>
                </Grid>
                <Divider />

                <Typography fontWeight="bold">Players Without Card</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm="auto">
                        <Tooltip title="Number or fraction.">
                            <TextField
                                label="Player Amount"
                                variant="outlined"
                                name="excludedPlayers"
                                type="text"
                                value={actionCardState.excludedPlayers}
                                onChange={event =>
                                    handleTextChange(
                                        event,
                                        actionCardState,
                                        setActionCardDataState
                                    )
                                }
                                fullWidth
                            />
                        </Tooltip>
                    </Grid>
                    <Grid item>
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
                </Grid>
                <Divider />

                <ActionCardPreviewComponent />
                <Divider />

                <Typography fontWeight="bold">Generic</Typography>
                <Grid container spacing={2}>
                    <Grid item>
                        <Tooltip title="The limit of cards is automatically set to the amount of players">
                            <FormControlLabel
                                control={
                                    <Switch
                                        defaultChecked={actionCardState.oneCardPerPlayer}
                                        onChange={event => {
                                            setActionCardDataState({
                                                ...actionCardState,
                                                oneCardPerPlayer: event.target.checked,
                                            })
                                        }}
                                    />
                                }
                                label="One Card Per Player"
                                labelPlacement="top"
                            />
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip title={'The action card can repeat and show up again.'}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        defaultChecked={actionCardState.cardRepeat}
                                        onChange={event => {
                                            setActionCardDataState({
                                                ...actionCardState,
                                                cardRepeat: event.target.checked,
                                            })
                                        }}
                                    />
                                }
                                label="Card Repeat"
                                labelPlacement="top"
                            />
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip title="Allows the same player to receive cards, even though they recently had one. Normally, players will not receive a new card until all other players have had one.">
                            <FormControlLabel
                                control={
                                    <Switch
                                        defaultChecked={actionCardState.playerRepeat}
                                        onChange={event => {
                                            setActionCardDataState({
                                                ...actionCardState,
                                                playerRepeat: event.target.checked,
                                            })
                                        }}
                                    />
                                }
                                label="Player Repeat"
                                labelPlacement="top"
                            />
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip
                            title={
                                'If the players will be creative and make their custom action cards.'
                            }
                        >
                            <FormControlLabel
                                control={
                                    <Switch
                                        defaultChecked={actionCardState.allowCustomCards}
                                        onChange={event => {
                                            setActionCardDataState({
                                                ...actionCardState,
                                                allowCustomCards: event.target.checked,
                                            })
                                        }}
                                    />
                                }
                                label="Custom Cards"
                                labelPlacement="top"
                            />
                        </Tooltip>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
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
                <Divider />

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
                    {actionCardState.cardSeconds && actionCardState.cardSeconds > 0 && (
                        <>
                            <Grid item>
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
                                                        hasOvertime: false,
                                                    })
                                                }}
                                            />
                                        }
                                        label="Auto-next"
                                        labelPlacement="top"
                                    />
                                </Tooltip>
                            </Grid>
                            {!actionCardState.isAutoNext && (
                                <Grid item>
                                    <Tooltip title="Allows the timer to go into overtime. The action card disappears, but the timer keeps running.">
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    defaultChecked={
                                                        actionCardState.hasOvertime
                                                    }
                                                    onChange={event => {
                                                        setActionCardDataState({
                                                            ...actionCardState,
                                                            hasOvertime: event.target.checked,
                                                        })
                                                    }}
                                                />
                                            }
                                            label="Overtime"
                                            labelPlacement="top"
                                        />
                                    </Tooltip>
                                </Grid>
                            )}
                        </>
                    )}
                </Grid>
                <Divider />

                <Typography fontWeight="bold">Prompts</Typography>
                <Grid container spacing={2}>
                    {actionCardState.excludedPlayers &&
                        actionCardState.excludedPlayers.length > 0 && (
                            <Grid item xs={12} sm={6}>
                                <Tooltip title="This prompt will show on the screens of the players not receiving cards.">
                                    <TextFieldSuggestionsComponent
                                        wordSuggestions={actionCardSuggestions}
                                        label="Excluded Player Prompt"
                                        variant="filled"
                                        name="excludedPlayerPrompt"
                                        multiline
                                        fullWidth
                                        required
                                        value={
                                            actionCardTranslationsState.en
                                                ?.excludedPlayerPrompt
                                        }
                                        setValue={newValue =>
                                            setActionCardTranslationsState({
                                                ...actionCardTranslationsState,
                                                en: {
                                                    ...actionCardTranslationsState.en,
                                                    excludedPlayerPrompt: newValue,
                                                },
                                            })
                                        }
                                    />
                                </Tooltip>
                            </Grid>
                        )}
                    {actionCardState.hasOvertime && (
                        <Grid item xs={12} sm={6}>
                            <Tooltip title="This prompt will show on the screen when an action card timer is in overtime.">
                                <TextFieldSuggestionsComponent
                                    wordSuggestions={actionCardSuggestions}
                                    label="Overtime Prompt"
                                    variant="filled"
                                    name="overtimePrompt"
                                    multiline
                                    fullWidth
                                    required
                                    value={actionCardTranslationsState.en?.overtimePrompt}
                                    setValue={newValue =>
                                        setActionCardTranslationsState({
                                            ...actionCardTranslationsState,
                                            en: {
                                                ...actionCardTranslationsState.en,
                                                overtimePrompt: newValue,
                                            },
                                        })
                                    }
                                />
                            </Tooltip>
                        </Grid>
                    )}
                    {actionCardState.allowCustomCards && (
                        <Grid item xs={12} sm={6}>
                            <Tooltip
                                title={
                                    'This prompt will show between games if the players have checked "Custom Cards". They will write sentences or words based on this prompt.'
                                }
                            >
                                <TextFieldSuggestionsComponent
                                    wordSuggestions={actionCardSuggestions}
                                    label="Custom Cards Prompt"
                                    variant="filled"
                                    name="playerCreativePrompt"
                                    multiline
                                    fullWidth
                                    required
                                    value={actionCardTranslationsState.en?.customCardPrompt}
                                    setValue={newValue =>
                                        setActionCardTranslationsState({
                                            ...actionCardTranslationsState,
                                            en: {
                                                ...actionCardTranslationsState.en,
                                                customCardPrompt: newValue,
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
                                value={actionCardTranslationsState.en?.actionPrompt}
                                setValue={newValue =>
                                    setActionCardTranslationsState({
                                        ...actionCardTranslationsState,
                                        en: {
                                            ...actionCardTranslationsState.en,
                                            actionPrompt: newValue,
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
