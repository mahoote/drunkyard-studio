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
import { useAlertStore } from '../../../../hooks/useAlertStore'
import { codeToLanguage } from '../../../../utils/languageUtils'
import { ActionCardTranslation } from '../../../../types/actionCard'
import { OTHER_LANGUAGES } from '../../../../constants/LANGUAGES'

const TranslationsFormComponent = () => {
    const {
        actionCardSettingsData,
        activeFormRef,
        gameTranslations,
        setGameTranslations,
        actionCardSettingsTranslations,
        actionCardTranslations,
        setActionCardSettingsTranslations,
        setActionCardTranslations,
    } = useNewGameStore()

    const { setAlert } = useAlertStore()

    const descriptions = gameTranslations.en.descriptions
    const accessories = gameTranslations.en.accessories
    const customEndGameSentence = gameTranslations.en.customEndGameSentence
    const hasWinnerPrompt = gameTranslations.en.hasWinnerPrompt
    const actionCardPrompt = actionCardSettingsTranslations.en.prompt
    const playerCreativePrompt = actionCardSettingsTranslations.en.playerCreativePrompt
    const actionCardsEn = actionCardTranslations.en

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
            actionCardSettings: {
                en: actionCardSettingsTranslations.en,
            },
            actionCards: {
                en: actionCardsEn,
            },
        }

        try {
            await navigator.clipboard.writeText(
                generateTranslationPrompt(OTHER_LANGUAGES, englishTranslations)
            )
            setAlert({
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

            setAlert({
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
            if (
                actionCardSettingsData &&
                newTranslations.actionCardSettings &&
                newTranslations.actionCards
            ) {
                setActionCardSettingsTranslations({
                    ...newTranslations.actionCardSettings,
                    en: actionCardSettingsTranslations.en,
                })

                // Iterates through the original translated action cards,
                // and sets their id on the new translated ones.
                const actionCards: { [k: string]: ActionCardTranslation[] | undefined } =
                    Object.fromEntries(
                        Object.entries(newTranslations.actionCards).map(
                            ([key, translations]) => [
                                key,
                                translations?.map(
                                    ({ id, value, actionCardId }, index) =>
                                        ({
                                            id: actionCardTranslations[key]?.[index]?.id ?? id,
                                            value,
                                            actionCardId:
                                                actionCardTranslations[key]?.[index]
                                                    ?.actionCardId ?? actionCardId,
                                        }) as ActionCardTranslation
                                ),
                            ]
                        )
                    )

                setActionCardTranslations({ ...actionCards, en: actionCardsEn })
            }

            setOpenModal(false)
            window.location.reload()
        } catch (error) {
            console.error('Failed to parse JSON:', error)
            setAlert({
                open: true,
                severity: 'error',
                message: 'Failed to parse JSON',
            })
        }
    }

    useEffect(() => {
        const hasPromptToTranslate =
            !!actionCardPrompt || !!actionCardSettingsData?.isPlayerCreative

        setPromptToTranslate(hasPromptToTranslate)
    }, [actionCardPrompt, actionCardSettingsData?.isPlayerCreative])

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
                                    required
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
                                    description => description.text
                                )}
                                setInputValues={values =>
                                    setGameTranslations({
                                        ...gameTranslations,
                                        [language]: {
                                            ...gameTranslations[language],
                                            descriptions: values.map((value, index) => ({
                                                text: value,
                                                side: descriptions[index].side,
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

                {accessories && accessories.length > 0 && (
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
                                        values={accessories}
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

                {customEndGameSentence && (
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <div>
                                <h3>Custom 'How to End the Game' Sentence</h3>
                                <MultilineComponent text={customEndGameSentence} />
                            </div>
                            {OTHER_LANGUAGES.map(language => (
                                <TextField
                                    key={language}
                                    label={codeToLanguage(language)}
                                    variant="filled"
                                    name={`${language}CustomEndGameSentence`}
                                    fullWidth
                                    multiline
                                    required
                                    value={gameTranslations[language]?.customEndGameSentence}
                                    onChange={event =>
                                        setGameTranslations({
                                            ...gameTranslations,
                                            [language]: {
                                                ...gameTranslations[language],
                                                customEndGameSentence: event.target.value,
                                            },
                                        })
                                    }
                                />
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
                                    required
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

                {actionCardSettingsData && (
                    <Typography variant="h6">Action Card Settings</Typography>
                )}

                {promptToTranslate && (
                    <>
                        <Grid container spacing={2}>
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
                                                required
                                                value={
                                                    actionCardSettingsTranslations[language]
                                                        ?.prompt
                                                }
                                                onChange={event =>
                                                    setActionCardSettingsTranslations({
                                                        ...actionCardSettingsTranslations,
                                                        [language]: {
                                                            ...actionCardSettingsTranslations[
                                                                language
                                                            ],
                                                            prompt: event.target.value,
                                                        },
                                                    })
                                                }
                                            />
                                        ))}
                                    </Box>
                                </Grid>
                            )}
                            {actionCardSettingsData?.isPlayerCreative &&
                                playerCreativePrompt && (
                                    <Grid item xs={12} md={6}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 2,
                                            }}
                                        >
                                            <div>
                                                <h3>Player Creative Prompt</h3>
                                                <MultilineComponent
                                                    text={playerCreativePrompt}
                                                />
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
                                                    required
                                                    value={
                                                        actionCardSettingsTranslations[
                                                            language
                                                        ]?.playerCreativePrompt
                                                    }
                                                    onChange={event =>
                                                        setActionCardSettingsTranslations({
                                                            ...actionCardSettingsTranslations,
                                                            [language]: {
                                                                ...actionCardSettingsTranslations[
                                                                    language
                                                                ],
                                                                playerCreativePrompt:
                                                                    event.target.value,
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
                                        values={actionCardsEn.map(card => card.value)}
                                        gridXs={12}
                                        gridSm={6}
                                        multiline={actionCardSettingsData?.allowSentence}
                                        inputValues={actionCardTranslations[language]?.map(
                                            card => card.value
                                        )}
                                        setInputValues={values =>
                                            setActionCardTranslations({
                                                ...actionCardTranslations,
                                                [language]: actionCardsEn.map((_, index) => ({
                                                    id: actionCardTranslations[language]?.[
                                                        index
                                                    ]?.id,
                                                    value: values[index],
                                                    actionCardId:
                                                        actionCardTranslations[language]?.[
                                                            index
                                                        ]?.actionCardId,
                                                })),
                                            })
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
