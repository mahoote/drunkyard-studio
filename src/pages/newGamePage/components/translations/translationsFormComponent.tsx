import React, { useEffect, useState } from 'react'
import { Box, Button, Divider, Grid, TextField, Typography } from '@mui/material'
import { useNewGameStore } from '../../../../hooks/useNewGameStore'
import { actionCardSuggestions } from '../../../../constants/WORD_SUGGESTION_DATA'
import TextFieldSuggestionsComponent from '../../../../components/textFieldSuggestionsComponent'
import MultilineComponent from '../../../../components/multilineComponent'
import TranslateStringArrayComponent from './translateStringArrayComponent'
import { NewGameTranslations } from '../../../../types/newGame'
import { Add, ContentCopy, DataObject } from '@mui/icons-material'
import AppModalComponent from '../../../../components/appModalComponent'
import { generateTranslationPrompt } from '../../../../utils/prompts'
import { useAlertStore } from '../../../../hooks/useAlertStore'
import { codeToLanguage } from '../../../../utils/languageUtils'

const TranslationsFormComponent = () => {
    const {
        newGame,
        advancedSettingsData,
        actionCardSettingsData,
        actionCardInputs,
        activeFormRef,
        newGameTranslations,
        setNewGameTranslations,
        selectedAccessories,
    } = useNewGameStore()

    const { setAlert } = useAlertStore()

    const languages = ['no']

    const [userJsonInput, setUserJsonInput] = useState<string>('')

    const [openModal, setOpenModal] = useState<boolean>(false)

    const [copyJsonBackupText, setCopyJsonBackupText] = useState<string | undefined>()

    const [promptToTranslate, setPromptToTranslate] = useState<boolean>(false)

    /**
     * Copies the JSON object to the clipboard.
     * Alerts the user if it fails.
     */
    const handleCopyFromEnglish = async () => {
        const englishTranslations: NewGameTranslations = {
            en: {
                name: newGame.name,
                introDescription: newGame.introDescription,
                descriptions: newGame.descriptions.filter(
                    description => description.length > 0
                ),
                customEndGameSentence: advancedSettingsData.customEndGameSentence,
                prompt: actionCardSettingsData?.prompt,
                playerCreativePrompt: actionCardSettingsData?.playerCreativePrompt,
                actionCardInputs: actionCardInputs?.filter(input => input.length > 0),
                accessories: selectedAccessories ?? undefined,
            },
        }

        try {
            await navigator.clipboard.writeText(
                generateTranslationPrompt(languages, englishTranslations)
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
                    generateTranslationPrompt(languages, englishTranslations)
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
            const newTranslations = JSON.parse(userJsonInput) as NewGameTranslations
            setNewGameTranslations(newTranslations)
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
            !!actionCardSettingsData?.prompt || !!actionCardSettingsData?.isPlayerCreative

        setPromptToTranslate(hasPromptToTranslate)
    }, [actionCardSettingsData?.prompt, actionCardSettingsData?.isPlayerCreative])

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
                                <div>{newGame.name}</div>
                            </div>
                            {languages.map(language => (
                                <TextField
                                    key={language}
                                    label={codeToLanguage(language)}
                                    variant="filled"
                                    name={`${language}Name`}
                                    required
                                    fullWidth
                                    value={newGameTranslations[language]?.name}
                                    onChange={event =>
                                        setNewGameTranslations({
                                            ...newGameTranslations,
                                            [language]: {
                                                ...newGameTranslations[language],
                                                name: event.target.value,
                                            },
                                        })
                                    }
                                />
                            ))}
                        </Box>
                    </Grid>

                    {newGame.introDescription && (
                        <Grid item xs={12} md={6}>
                            {/* The divider beneath the name input. */}
                            <Box sx={{ display: { md: 'none' } }}>
                                <Divider />
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <div>
                                    <h3>Intro Description</h3>
                                    <MultilineComponent text={newGame.introDescription} />
                                </div>
                                {languages.map(language => (
                                    <TextFieldSuggestionsComponent
                                        key={language}
                                        wordSuggestions={actionCardSuggestions}
                                        label={codeToLanguage(language)}
                                        name={`${language}IntroDescription`}
                                        variant="filled"
                                        multiline
                                        required
                                        fullWidth
                                        value={newGameTranslations[language]?.introDescription}
                                        onChange={event =>
                                            setNewGameTranslations({
                                                ...newGameTranslations,
                                                [language]: {
                                                    ...newGameTranslations[language],
                                                    introDescription: event.target.value,
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

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <h3>Description</h3>
                    {languages.map(language => (
                        <Box
                            key={language}
                            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                        >
                            <Typography fontSize={18} color="darkgray">
                                {codeToLanguage(language)} *
                            </Typography>
                            <TranslateStringArrayComponent
                                values={newGame.descriptions}
                                minRows={4}
                                minHeight="13rem"
                                gridXs={12}
                                gridMd={6}
                                multiline={true}
                                inputValues={newGameTranslations[language]?.descriptions}
                                setInputValues={values =>
                                    setNewGameTranslations({
                                        ...newGameTranslations,
                                        [language]: {
                                            ...newGameTranslations[language],
                                            descriptions: values,
                                        },
                                    })
                                }
                            />
                        </Box>
                    ))}
                </Box>
                <Divider />

                {selectedAccessories.length > 0 && (
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <h3>Accessories</h3>
                            {languages.map(language => (
                                <Box
                                    key={language}
                                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                                >
                                    <Typography fontSize={18} color="darkgray">
                                        {codeToLanguage(language)} *
                                    </Typography>
                                    <TranslateStringArrayComponent
                                        values={selectedAccessories}
                                        gridXs={12}
                                        gridMd={6}
                                        inputValues={
                                            newGameTranslations[language]?.accessories
                                        }
                                        setInputValues={values =>
                                            setNewGameTranslations({
                                                ...newGameTranslations,
                                                [language]: {
                                                    ...newGameTranslations[language],
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

                {advancedSettingsData.customEndGameSentence && (
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <div>
                                <h3>Custom 'How to End the Game' Sentence</h3>
                                <MultilineComponent
                                    text={advancedSettingsData.customEndGameSentence}
                                />
                            </div>
                            {languages.map(language => (
                                <TextField
                                    key={language}
                                    label={codeToLanguage(language)}
                                    variant="filled"
                                    name={`${language}CustomEndGameSentence`}
                                    fullWidth
                                    multiline
                                    required
                                    value={
                                        newGameTranslations[language]?.customEndGameSentence
                                    }
                                    onChange={event =>
                                        setNewGameTranslations({
                                            ...newGameTranslations,
                                            [language]: {
                                                ...newGameTranslations[language],
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

                {actionCardSettingsData && (
                    <Typography variant="h6">Action Card Settings</Typography>
                )}

                {promptToTranslate && (
                    <>
                        <Grid container spacing={2}>
                            {actionCardSettingsData?.prompt && (
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
                                            <MultilineComponent
                                                text={actionCardSettingsData.prompt}
                                            />
                                        </div>
                                        {languages.map(language => (
                                            <TextFieldSuggestionsComponent
                                                key={language}
                                                wordSuggestions={actionCardSuggestions}
                                                label={codeToLanguage(language)}
                                                variant="filled"
                                                name={`${language}Prompt`}
                                                fullWidth
                                                required
                                                value={newGameTranslations[language]?.prompt}
                                                onChange={event =>
                                                    setNewGameTranslations({
                                                        ...newGameTranslations,
                                                        [language]: {
                                                            ...newGameTranslations[language],
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
                                actionCardSettingsData?.playerCreativePrompt && (
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
                                                    text={
                                                        actionCardSettingsData.playerCreativePrompt
                                                    }
                                                />
                                            </div>
                                            {languages.map(language => (
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
                                                        newGameTranslations[language]
                                                            ?.playerCreativePrompt
                                                    }
                                                    onChange={event =>
                                                        setNewGameTranslations({
                                                            ...newGameTranslations,
                                                            [language]: {
                                                                ...newGameTranslations[
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

                {actionCardInputs && (
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <h3>Action Cards</h3>
                            {languages.map(language => (
                                <Box
                                    key={language}
                                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                                >
                                    <Typography fontSize={18} color="darkgray">
                                        {codeToLanguage(language)} *
                                    </Typography>
                                    <TranslateStringArrayComponent
                                        values={actionCardInputs}
                                        gridXs={12}
                                        gridSm={6}
                                        multiline={actionCardSettingsData?.allowSentence}
                                        inputValues={
                                            newGameTranslations[language]?.actionCardInputs
                                        }
                                        setInputValues={values =>
                                            setNewGameTranslations({
                                                ...newGameTranslations,
                                                [language]: {
                                                    ...newGameTranslations[language],
                                                    actionCardInputs: values,
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
            </Box>
        </Box>
    )
}

export default TranslationsFormComponent
