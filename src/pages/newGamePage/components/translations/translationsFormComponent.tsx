import React, { useEffect, useState } from 'react'
import { Box, Button, Divider, Grid, TextField, Typography } from '@mui/material'
import { useNewGameStore } from '../../../../hooks/useNewGameStore'
import { actionCardSuggestions } from '../../../../constants/WORD_SUGGESTION_DATA'
import TextFieldSuggestionsComponent from '../../../../components/textFieldSuggestionsComponent'
import MultilineComponent from '../../../../components/multilineComponent'
import TranslateStringArrayComponent from './translateStringArrayComponent'
import { CombinedTranslations, GameTranslations } from '../../../../types/newGame'
import { Add, ContentCopy, DataObject } from '@mui/icons-material'
import AppModalComponent from '../../../../components/appModalComponent'
import { generateTranslationPrompt } from '../../../../utils/prompts'
import { useStudioStore } from '../../../../hooks/useStudioStore'
import { codeToLanguage } from '../../../../utils/languageUtils'
import { OTHER_LANGUAGES } from '../../../../constants/LANGUAGES'
import { GameLanguage } from '../../../../types/language'
import { useGameOptionsStore } from '../../../../hooks/useGameOptionsStore'
import { ActionCardTranslations } from '../../../../types/actionCard'

const TranslationsFormComponent = () => {
    const {
        actionCardState,
        activeFormRef,
        gameTranslations,
        setGameTranslations,
        actionCardTranslationsState,
        setActionCardTranslationsState,
        advancedSettingsData,
        setActionCardTexts,
    } = useNewGameStore()

    const { accessories } = useGameOptionsStore()

    const { setStudioAlert } = useStudioStore()

    const descriptions = gameTranslations.en.descriptions

    const accessoryNames = new Set(accessories.map(a => a.name))
    const englishAccessories = gameTranslations.en.accessories?.filter(
        accessory => !accessoryNames.has(accessory)
    )

    // Action Card
    // Only show the action card translations if there are action cards in the game.
    // This is determined by checking if there is at least one prompt or if custom cards are allowed.
    const hasWinnerPrompt =
        advancedSettingsData.hasWinner && gameTranslations.en.hasWinnerPrompt
    const actionCardPrompt = actionCardTranslationsState.en?.actionPrompt
    const customCardPrompt = actionCardTranslationsState.en?.customCardPrompt
    const excludedPlayerPrompt = actionCardTranslationsState.en?.excludedPlayerPrompt
    const overtimePrompt = actionCardTranslationsState.en?.overtimePrompt
    const buzzedPrompt = actionCardTranslationsState.en?.buzzedPrompt
    const actionCardsEn = actionCardTranslationsState.en.texts

    const [userJsonInput, setUserJsonInput] = useState<string>('')

    const [openModal, setOpenModal] = useState<boolean>(false)

    const [copyJsonBackupText, setCopyJsonBackupText] = useState<string | undefined>()

    const [promptToTranslate, setPromptToTranslate] = useState<boolean>(false)

    /**
     * Copies the JSON object to the clipboard.
     * Alerts the user if it fails.
     */
    const handleCopyFromEnglish = async () => {
        const englishTranslations: CombinedTranslations = {
            game: {
                en: gameTranslations.en,
            },
            actionCard: {
                en: actionCardTranslationsState.en,
            },
        }

        try {
            await navigator.clipboard.writeText(
                generateTranslationPrompt(OTHER_LANGUAGES, englishTranslations)
            )
            setStudioAlert({
                open: true,
                severity: 'success',
                message: 'Copied to clipboard',
            })
        } catch (error) {
            console.error('Failed to copy JSON to clipboard:', error)

            if (!navigator.clipboard) {
                console.error('Clipboard API is not supported in this environment.')
                setCopyJsonBackupText(
                    generateTranslationPrompt(OTHER_LANGUAGES, englishTranslations)
                )
            }

            setStudioAlert({
                open: true,
                severity: 'error',
                message: 'Failed to copy to clipboard',
            })
        }
    }

    /**
     * Adds the JSON object to the translations object.
     */
    const handleJsonAdd = () => {
        try {
            const newTranslations = JSON.parse(userJsonInput) as CombinedTranslations

            // Game State
            const newTranslationsWithCorrectId: GameTranslations = Object.fromEntries(
                Object.entries(newTranslations.game).map(([key, translation]) => [
                    key,
                    {
                        ...translation,
                        id: gameTranslations[key]?.id,
                    },
                ])
            )
            setGameTranslations({ en: gameTranslations.en, ...newTranslationsWithCorrectId })

            // Action Card State
            if (actionCardState && newTranslations.actionCard) {
                const acTranslationsWithCorrectId: ActionCardTranslations = Object.fromEntries(
                    Object.entries(newTranslations.actionCard).map(([key, translation]) => [
                        key,
                        {
                            ...translation,
                            id: actionCardTranslationsState[key]?.id,
                        },
                    ])
                )

                setActionCardTranslationsState({
                    en: actionCardTranslationsState.en,
                    ...acTranslationsWithCorrectId,
                })
            }

            setOpenModal(false)
            window.location.reload()
        } catch (error) {
            console.error('Failed to parse JSON:', error)
            setStudioAlert({
                open: true,
                severity: 'error',
                message: 'Failed to parse JSON',
            })
        }
    }

    useEffect(() => {
        const hasPromptToTranslate =
            !!actionCardPrompt ||
            !!actionCardState?.allowCustomCards ||
            !!actionCardState?.hasOvertime ||
            !!actionCardState?.hasBuzzer ||
            !!(actionCardState?.excludedPlayers && actionCardState.excludedPlayers.length > 0)

        setPromptToTranslate(hasPromptToTranslate)
    }, [actionCardPrompt, actionCardState?.allowCustomCards])

    return (
        <Box>
            <Box component="p" color="darkgray" textAlign="center">
                This subpage allows you to provide translations for the text fields you have
                filled out in the previous steps of the form.
                <br />
                Ensuring accurate translations helps make the game accessible and enjoyable for
                users in different languages.
            </Box>

            <Box my={6} gap={2} display="flex" justifyContent="center">
                <Button
                    variant="outlined"
                    endIcon={<ContentCopy />}
                    onClick={() => void handleCopyFromEnglish()}
                >
                    Copy from English
                </Button>
                <Button
                    variant="outlined"
                    endIcon={<DataObject />}
                    onClick={() => {
                        setOpenModal(true)
                        setCopyJsonBackupText(undefined)
                    }}
                >
                    Insert from JSON
                </Button>
            </Box>

            {/* If the copy to clipboard doesn't work, just print it in the browser. */}
            {copyJsonBackupText && <Box>{copyJsonBackupText}</Box>}

            <AppModalComponent
                open={openModal}
                handleClose={() => {
                    setOpenModal(false)
                }}
                title="Insert translations JSON object"
            >
                <>
                    <TextField
                        sx={{ mt: 2 }}
                        variant="outlined"
                        name="jsonObject"
                        value={userJsonInput}
                        onChange={event => setUserJsonInput(event.target.value)}
                        multiline
                        fullWidth
                        minRows={6}
                        maxRows={18}
                    />
                    <Box display="flex" justifyContent="end" mt={2}>
                        <Button
                            variant="contained"
                            endIcon={<Add />}
                            onClick={handleJsonAdd}
                            disabled={userJsonInput.length <= 0}
                        >
                            Add
                        </Button>
                    </Box>
                </>
            </AppModalComponent>

            <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                component="form"
                ref={activeFormRef}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <div>
                                <h3>Name</h3>
                                <div>{gameTranslations.en.name}</div>
                            </div>
                            {OTHER_LANGUAGES.map(language => (
                                <TextField
                                    key={language}
                                    label={codeToLanguage(language)}
                                    variant="filled"
                                    name={`${language}Name`}
                                    fullWidth
                                    value={gameTranslations[language]?.name}
                                    onChange={event =>
                                        setGameTranslations({
                                            ...gameTranslations,
                                            [language]: {
                                                ...gameTranslations[language],
                                                name: event.target.value,
                                            },
                                        })
                                    }
                                />
                            ))}
                        </Box>
                    </Grid>
                </Grid>

                <Divider />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <h3>Description</h3>
                    {OTHER_LANGUAGES.map(language => (
                        <Box
                            key={language}
                            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                        >
                            <Typography fontSize={18} color="darkgray">
                                {codeToLanguage(language)} *
                            </Typography>
                            <TranslateStringArrayComponent
                                values={descriptions.map(description => description.text)}
                                minRows={2}
                                minHeight="6rem"
                                gridXs={12}
                                gridMd={6}
                                multiline={true}
                                inputValues={gameTranslations[language]?.descriptions.map(
                                    description => description?.text ?? ''
                                )}
                                setInputValues={values =>
                                    setGameTranslations({
                                        ...gameTranslations,
                                        [language]: {
                                            ...gameTranslations[language],
                                            descriptions: values.map((value, index) => ({
                                                text: value,
                                                pause: descriptions[index].pause,
                                            })),
                                        },
                                    })
                                }
                            />
                        </Box>
                    ))}
                </Box>
                <Divider />

                {englishAccessories && englishAccessories.length > 0 && (
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <h3>Accessories</h3>
                            {OTHER_LANGUAGES.map(language => (
                                <Box
                                    key={language}
                                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                                >
                                    <Typography fontSize={18} color="darkgray">
                                        {codeToLanguage(language)} *
                                    </Typography>
                                    <TranslateStringArrayComponent
                                        values={englishAccessories}
                                        gridXs={12}
                                        gridMd={6}
                                        noWhiteSpace={false}
                                        inputValues={gameTranslations[language]?.accessories}
                                        setInputValues={values =>
                                            setGameTranslations({
                                                ...gameTranslations,
                                                [language]: {
                                                    ...gameTranslations[language],
                                                    accessories: values,
                                                },
                                            })
                                        }
                                    />
                                </Box>
                            ))}
                        </Box>
                        <Divider />
                    </>
                )}

                {hasWinnerPrompt && (
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <div>
                                <h3>Has Winner Prompt</h3>
                                <MultilineComponent text={hasWinnerPrompt} />
                            </div>
                            {OTHER_LANGUAGES.map(language => (
                                <TextField
                                    key={language}
                                    label={codeToLanguage(language)}
                                    variant="filled"
                                    name={`${language}HasWinnerPrompt`}
                                    fullWidth
                                    multiline
                                    value={gameTranslations[language]?.hasWinnerPrompt}
                                    onChange={event =>
                                        setGameTranslations({
                                            ...gameTranslations,
                                            [language]: {
                                                ...gameTranslations[language],
                                                hasWinnerPrompt: event.target.value,
                                            },
                                        })
                                    }
                                />
                            ))}
                        </Box>
                        <Divider />
                    </>
                )}

                {actionCardState && <Typography variant="h6">Action Card Settings</Typography>}

                {promptToTranslate && (
                    <>
                        <Grid container spacing={2}>
                            {actionCardState?.excludedPlayers &&
                                actionCardState.excludedPlayers.length > 0 &&
                                excludedPlayerPrompt && (
                                    <Grid item xs={12} md={6}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 2,
                                            }}
                                        >
                                            <div>
                                                <h3>Excluded Player Prompt</h3>
                                                <MultilineComponent
                                                    text={excludedPlayerPrompt}
                                                />
                                            </div>
                                            {OTHER_LANGUAGES.map(language => (
                                                <TextFieldSuggestionsComponent
                                                    key={language}
                                                    wordSuggestions={actionCardSuggestions}
                                                    label={codeToLanguage(language)}
                                                    variant="filled"
                                                    name={`${language}ExcludedPlayerPrompt`}
                                                    multiline
                                                    fullWidth
                                                    value={
                                                        actionCardTranslationsState[language]
                                                            ?.excludedPlayerPrompt
                                                    }
                                                    onChange={event =>
                                                        setActionCardTranslationsState({
                                                            ...actionCardTranslationsState,
                                                            [language]: {
                                                                ...actionCardTranslationsState[
                                                                    language
                                                                ],
                                                                excludedPlayerPrompt:
                                                                    event.target.value,
                                                            },
                                                        })
                                                    }
                                                />
                                            ))}
                                        </Box>
                                    </Grid>
                                )}
                            {actionCardState?.hasOvertime && overtimePrompt && (
                                <Grid item xs={12} md={6}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 2,
                                        }}
                                    >
                                        <div>
                                            <h3>Overtime Prompt</h3>
                                            <MultilineComponent text={overtimePrompt} />
                                        </div>
                                        {OTHER_LANGUAGES.map(language => (
                                            <TextFieldSuggestionsComponent
                                                key={language}
                                                wordSuggestions={actionCardSuggestions}
                                                label={codeToLanguage(language)}
                                                variant="filled"
                                                name={`${language}OvertimePrompt`}
                                                multiline
                                                fullWidth
                                                value={
                                                    actionCardTranslationsState[language]
                                                        ?.overtimePrompt
                                                }
                                                onChange={event =>
                                                    setActionCardTranslationsState({
                                                        ...actionCardTranslationsState,
                                                        [language]: {
                                                            ...actionCardTranslationsState[
                                                                language
                                                            ],
                                                            overtimePrompt: event.target.value,
                                                        },
                                                    })
                                                }
                                            />
                                        ))}
                                    </Box>
                                </Grid>
                            )}
                            {actionCardState?.hasBuzzer && buzzedPrompt && (
                                <Grid item xs={12} md={6}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 2,
                                        }}
                                    >
                                        <div>
                                            <h3>Buzzed Prompt</h3>
                                            <MultilineComponent text={buzzedPrompt} />
                                        </div>
                                        {OTHER_LANGUAGES.map(language => (
                                            <TextFieldSuggestionsComponent
                                                key={language}
                                                wordSuggestions={actionCardSuggestions}
                                                label={codeToLanguage(language)}
                                                variant="filled"
                                                name={`${language}BuzzedPrompt`}
                                                multiline
                                                fullWidth
                                                value={
                                                    actionCardTranslationsState[language]
                                                        ?.buzzedPrompt
                                                }
                                                onChange={event =>
                                                    setActionCardTranslationsState({
                                                        ...actionCardTranslationsState,
                                                        [language]: {
                                                            ...actionCardTranslationsState[
                                                                language
                                                            ],
                                                            buzzedPrompt: event.target.value,
                                                        },
                                                    })
                                                }
                                            />
                                        ))}
                                    </Box>
                                </Grid>
                            )}
                            {actionCardState?.allowCustomCards && customCardPrompt && (
                                <Grid item xs={12} md={6}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 2,
                                        }}
                                    >
                                        <div>
                                            <h3>Custom Cards Prompt</h3>
                                            <MultilineComponent text={customCardPrompt} />
                                        </div>
                                        {OTHER_LANGUAGES.map(language => (
                                            <TextFieldSuggestionsComponent
                                                key={language}
                                                wordSuggestions={actionCardSuggestions}
                                                label={codeToLanguage(language)}
                                                variant="filled"
                                                name={`${language}PlayerCreativePrompt`}
                                                multiline
                                                fullWidth
                                                value={
                                                    actionCardTranslationsState[language]
                                                        ?.customCardPrompt
                                                }
                                                onChange={event =>
                                                    setActionCardTranslationsState({
                                                        ...actionCardTranslationsState,
                                                        [language]: {
                                                            ...actionCardTranslationsState[
                                                                language
                                                            ],
                                                            customCardPrompt:
                                                                event.target.value,
                                                        },
                                                    })
                                                }
                                            />
                                        ))}
                                    </Box>
                                </Grid>
                            )}
                            {actionCardPrompt && (
                                <Grid item xs={12} md={6}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 2,
                                        }}
                                    >
                                        <div>
                                            <h3>Prompt</h3>
                                            <MultilineComponent text={actionCardPrompt} />
                                        </div>
                                        {OTHER_LANGUAGES.map(language => (
                                            <TextFieldSuggestionsComponent
                                                key={language}
                                                wordSuggestions={actionCardSuggestions}
                                                label={codeToLanguage(language)}
                                                variant="filled"
                                                name={`${language}Prompt`}
                                                fullWidth
                                                value={
                                                    actionCardTranslationsState[language]
                                                        ?.actionPrompt
                                                }
                                                onChange={event =>
                                                    setActionCardTranslationsState({
                                                        ...actionCardTranslationsState,
                                                        [language]: {
                                                            ...actionCardTranslationsState[
                                                                language
                                                            ],
                                                            actionPrompt: event.target.value,
                                                        },
                                                    })
                                                }
                                            />
                                        ))}
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                        <Divider />
                    </>
                )}

                {actionCardsEn && (
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <h3>Action Cards</h3>
                            {OTHER_LANGUAGES.map(language => (
                                <Box
                                    key={language}
                                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                                >
                                    <Typography fontSize={18} color="darkgray">
                                        {codeToLanguage(language)} *
                                    </Typography>
                                    <TranslateStringArrayComponent
                                        values={actionCardsEn}
                                        gridXs={12}
                                        gridSm={6}
                                        multiline={actionCardState?.allowSentence}
                                        inputValues={
                                            actionCardTranslationsState[language].texts
                                        }
                                        setInputValues={values =>
                                            setActionCardTexts(
                                                values,
                                                language as GameLanguage
                                            )
                                        }
                                    />
                                </Box>
                            ))}
                        </Box>
                        <Divider />
                    </>
                )}
            </Box>
        </Box>
    )
}

export default TranslationsFormComponent
