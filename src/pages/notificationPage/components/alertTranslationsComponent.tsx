import React from 'react'
import { ALL_LANGUAGES } from '../../../constants/LANGUAGES'
import { Box, Divider, Grid, TextField } from '@mui/material'
import { handleTextChange } from '../../../utils/inputUtils'
import { InAppAlertTranslationDto } from '../../../types/notification'
import { useNotificationStore } from '../../../hooks/useNotificationStore'
import { codeToLanguage } from '../../../utils/languageUtils'

interface LanguageAlertProps {
    language: string
    inAppAlertTranslation: InAppAlertTranslationDto
    setInAppAlertTranslation: (alert: InAppAlertTranslationDto) => void
}

/**
 * The form for the in-app alert translations.
 * @param language
 * @param inAppAlertTranslation
 * @param setInAppAlertTranslation
 * @constructor
 */
function AlertTranslationComponent({
    language,
    inAppAlertTranslation,
    setInAppAlertTranslation,
}: LanguageAlertProps) {
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label={`${language} Title`}
                        variant="filled"
                        name="title"
                        value={inAppAlertTranslation.title}
                        onChange={event =>
                            handleTextChange(
                                event,
                                inAppAlertTranslation,
                                setInAppAlertTranslation
                            )
                        }
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label={`${language} Description`}
                        variant="filled"
                        name="description"
                        value={inAppAlertTranslation.description}
                        onChange={event =>
                            handleTextChange(
                                event,
                                inAppAlertTranslation,
                                setInAppAlertTranslation
                            )
                        }
                        fullWidth
                        required
                        multiline
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label={`${language} Button Title`}
                        variant="outlined"
                        name="buttonTitle"
                        value={inAppAlertTranslation.buttonTitle}
                        onChange={event =>
                            handleTextChange(
                                event,
                                inAppAlertTranslation,
                                setInAppAlertTranslation
                            )
                        }
                        fullWidth
                    />
                </Grid>
            </Grid>
        </>
    )
}

/**
 * Maps through all the languages in the array and creates a translation component with the related language.
 * @constructor
 */
export default function AlertTranslationsComponent() {
    const { inAppAlertTranslations, setInAppAlertTranslations } = useNotificationStore()

    return ALL_LANGUAGES.map(language => (
        <Box key={language} display="flex" flexDirection="column" gap={2}>
            <Divider />
            <AlertTranslationComponent
                language={codeToLanguage(language)}
                inAppAlertTranslation={inAppAlertTranslations[language]}
                setInAppAlertTranslation={alert =>
                    setInAppAlertTranslations({
                        ...inAppAlertTranslations,
                        [language]: alert,
                    })
                }
            />
        </Box>
    ))
}
