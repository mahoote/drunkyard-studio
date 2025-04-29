import { Box, Button, Divider, Grid, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getLatestAppVersion, setNewAppVersion } from '../../services/appVersionService'
import { validNewAppVersion } from '../../utils/appVersionUtils'
import PageLoaderComponent from '../../components/pageLoaderComponent'
import { useNotificationStore } from '../../hooks/useNotificationStore'
import { handleTextChange } from '../../utils/inputUtils'
import { validNewAlert } from '../../utils/notificationsUtils'

const NotificationPage = () => {
    const [loading, setLoading] = useState<boolean>(true)

    const [appVersion, setAppVersion] = useState<string>('undefined')
    const [appVersionInput, setAppVersionInput] = useState<string>('')

    const { inAppAlert, setInAppAlert } = useNotificationStore()

    const fetchLatestAppVersion = async () => {
        const result = await getLatestAppVersion()
        const latestVersion = result?.latestVersion || 'undefined'
        setAppVersion(latestVersion)
    }

    /**
     * Handles the setting of a new app version.
     * Validates the new app version and updates it if valid.
     * Fetches the latest app version after setting the new version.
     */
    const handleSetNewAppVersion = async () => {
        if (validNewAppVersion(appVersionInput)) {
            try {
                setLoading(true)
                await setNewAppVersion(appVersionInput)
                setAppVersionInput('')
                await fetchLatestAppVersion()
            } catch (error) {
                console.error('Error setting new app version:', error)
            } finally {
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        try {
            setLoading(true)
            void fetchLatestAppVersion()
        } catch (error) {
            console.error('Error fetching latest app version:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    if (loading) {
        return <PageLoaderComponent />
    }

    return (
        <Box display="flex" flexDirection="column" gap={3}>
            <Box display="flex" flexDirection="column" gap={2}>
                <h3>New App Version</h3>
                <Box display="flex" gap={2} alignItems="center">
                    <TextField
                        label={`${appVersion} (latest)`}
                        variant="filled"
                        name="appVersion"
                        value={appVersionInput}
                        onChange={e => setAppVersionInput(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        disabled={!validNewAppVersion(appVersionInput)}
                        onClick={() => void handleSetNewAppVersion()}
                    >
                        Add Version
                    </Button>
                </Box>
                <Divider />
            </Box>
            <Box display="flex" flexDirection="column" gap={2} component="form">
                <h3>New In-App Alert</h3>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Target Version"
                            variant="filled"
                            name="targetVersion"
                            value={inAppAlert.targetVersion}
                            onChange={event =>
                                handleTextChange(event, inAppAlert, setInAppAlert)
                            }
                            fullWidth
                            required
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Title"
                            variant="filled"
                            name="title"
                            value={inAppAlert.title}
                            onChange={event =>
                                handleTextChange(event, inAppAlert, setInAppAlert)
                            }
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Description"
                            variant="filled"
                            name="description"
                            value={inAppAlert.description}
                            onChange={event =>
                                handleTextChange(event, inAppAlert, setInAppAlert)
                            }
                            fullWidth
                            required
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Button Title"
                            variant="outlined"
                            name="buttonTitle"
                            value={inAppAlert.buttonTitle}
                            onChange={event =>
                                handleTextChange(event, inAppAlert, setInAppAlert)
                            }
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Button Url"
                            variant="outlined"
                            name="buttonUrl"
                            value={inAppAlert.buttonUrl}
                            onChange={event =>
                                handleTextChange(event, inAppAlert, setInAppAlert)
                            }
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Button
                    variant="contained"
                    disabled={!validNewAlert(inAppAlert)}
                    onClick={() => {}}
                >
                    Add Alert
                </Button>
            </Box>
        </Box>
    )
}

export default NotificationPage
