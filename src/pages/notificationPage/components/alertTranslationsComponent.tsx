import React from 'react'
import { ALL_LANGUAGES } from '../../../constants/LANGUAGES'
import { Box, Divider, Grid, TextField } from '@mui/material'
import { handleTextChange } from '../../../utils/inputUtils'
import { useNotificationStore } from '../../../hooks/useNotificationStore'
import { codeToLanguage } from '../../../utils/languageUtils'
import { AlertTranslationDto } from '../../../types/notification'

interface LanguageAlertProps {
    language: string
    alertTranslation: AlertTranslationDto
    setAlertTranslation: (alert: AlertTranslationDto) => void
}

/**
 * The form for the in-app alert translations.
 * @param language
 * @param alertTranslation
 * @param setAlertTranslation
 * @constructor
 */
function AlertTranslationComponent({
    language,
    alertTranslation,
    setAlertTranslation,
}: LanguageAlertProps) {
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label={`${language} Title`}
                        variant="filled"
                        name="title"
                        value={alertTranslation.title}
                        onChange={event =>
                            handleTextChange(event, alertTranslation, setAlertTranslation)
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
                        value={alertTranslation.description}
                        onChange={event =>
                            handleTextChange(event, alertTranslation, setAlertTranslation)
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
                        value={alertTranslation.buttonTitle}
                        onChange={event =>
                            handleTextChange(event, alertTranslation, setAlertTranslation)
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
    const { alertTranslations, setAlertTranslations } = useNotificationStore()

    return ALL_LANGUAGES.map(language => (
        <Box key={language} display="flex" flexDirection="column" gap={2}>
            <Divider />
            <AlertTranslationComponent
                language={codeToLanguage(language)}
                alertTranslation={alertTranslations[language]}
                setAlertTranslation={alert =>
                    setAlertTranslations({
                        ...alertTranslations,
                        [language]: alert,
                    })
                }
            />
        </Box>
    ))
}
