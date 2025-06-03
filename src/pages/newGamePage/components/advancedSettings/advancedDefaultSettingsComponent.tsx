import {
    Box,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Radio,
    RadioGroup,
    Switch,
    TextField,
    Tooltip,
} from '@mui/material'
import React from 'react'
import { handleInputChange, handleGameTranslationChange } from '../../../../utils/inputUtils'
import ErrorMessageComponent from '../../../../components/errorMessageComponent'
import { useNewGameStore } from '../../../../hooks/useNewGameStore'
import ImageUploaderComponent from '../../../../components/imageUploaderComponent'

function AdvancedDefaultSettingsComponent() {
    const {
        advancedSettingsData,
        setAdvancedSettingsData,
        gameTranslations,
        setGameTranslations,
    } = useNewGameStore()

    if (!advancedSettingsData) {
        return <ErrorMessageComponent message="Could not load the Advanced Default settings" />
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Grid container columnGap={4} rowGap={2}>
                    <Grid item>
                        <FormControl>
                            <FormLabel id="advanced-settings-game-end-type-label">
                                Game End Type
                            </FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="advanced-settings-game-end-type-label"
                                name="gameEndType"
                                value={advancedSettingsData.gameEndType}
                                onChange={event =>
                                    handleInputChange(
                                        event,
                                        advancedSettingsData,
                                        setAdvancedSettingsData
                                    )
                                }
                            >
                                <Tooltip title="The game ends when a player choose to.">
                                    <FormControlLabel
                                        value="finish"
                                        control={<Radio />}
                                        label="Finish"
                                    />
                                </Tooltip>
                                <Tooltip title="Same as FINISH, but the player that chooses to end the game, get's a disadvantage">
                                    <FormControlLabel
                                        value="forfeit"
                                        control={<Radio />}
                                        label="Forfeit"
                                    />
                                </Tooltip>
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm="auto" alignContent="center">
                        <FormControl>
                            <FormLabel>Other Settings</FormLabel>
                            <Tooltip title="The playes will pick a winner at the end of the game based on who won.">
                                <FormControlLabel
                                    label="Has Winner"
                                    control={
                                        <Switch
                                            defaultChecked={advancedSettingsData.hasWinner}
                                            onChange={event =>
                                                setAdvancedSettingsData({
                                                    ...advancedSettingsData,
                                                    hasWinner: event.target.checked,
                                                })
                                            }
                                        />
                                    }
                                />
                            </Tooltip>
                        </FormControl>
                    </Grid>
                    {advancedSettingsData.hasWinner && (
                        <Grid item xs={12} md={6}>
                            <Tooltip title="Specific prompt to ask the players to pick a winner.">
                                <TextField
                                    label="Has Winner Prompt"
                                    variant="filled"
                                    name="hasWinnerPrompt"
                                    fullWidth
                                    value={gameTranslations.en.hasWinnerPrompt}
                                    onChange={event =>
                                        handleGameTranslationChange(
                                            event,
                                            gameTranslations,
                                            setGameTranslations
                                        )
                                    }
                                    multiline
                                    required
                                />
                            </Tooltip>
                        </Grid>
                    )}
                </Grid>
                <Grid container gap={2}>
                    <Grid item xs={12} alignContent="center">
                        <ImageUploaderComponent
                            image={advancedSettingsData.customRulesImage}
                            setImage={image =>
                                setAdvancedSettingsData({
                                    ...advancedSettingsData,
                                    customRulesImage: image,
                                })
                            }
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default AdvancedDefaultSettingsComponent
