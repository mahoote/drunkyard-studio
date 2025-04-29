import {
    Box,
    Button,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getAllAppVersions, setNewAppVersion } from '../../services/appVersionService'
import { validNewAppVersion } from '../../utils/appVersionUtils'
import PageLoaderComponent from '../../components/pageLoaderComponent'
import { useNotificationStore } from '../../hooks/useNotificationStore'
import { handleSelectChange, handleTextChange } from '../../utils/inputUtils'
import { validNewAlert } from '../../utils/notificationsUtils'
import { setNewAlert } from '../../services/alertService'
import { initialInAppAlert } from '../../constants/NOTIFICATION_DATA'

const NotificationPage = () => {
    const { inAppAlert, setInAppAlert } = useNotificationStore()

    const [loading, setLoading] = useState<boolean>(true)
    const [latestAppVersion, setLatestAppVersion] = useState<string>('undefined')
    const [allAppVersions, setAllAppVersions] = useState<string[]>([inAppAlert.targetVersion])
    const [appVersionInput, setAppVersionInput] = useState<string>('')

    const fetchAppVersions = async () => {
        const allVersionsResult = await getAllAppVersions()
        const allVersions = allVersionsResult?.versions || []

        setLatestAppVersion(allVersions[0])
        setAllAppVersions(allVersions)

        if (!validNewAppVersion(inAppAlert.targetVersion)) {
            inAppAlert.targetVersion = allVersions[0]
        }
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
                await fetchAppVersions()
            } catch (error) {
                console.error('Error setting new app version:', error)
            } finally {
                setLoading(false)
            }
        }
    }

    const handleSetNewAlert = async () => {
        if (validNewAlert(inAppAlert)) {
            try {
                setLoading(true)
                await setNewAlert(inAppAlert)
                setInAppAlert(initialInAppAlert)
            } catch (error) {
                console.error('Error setting new alert:', error)
            } finally {
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        try {
            setLoading(true)
            void fetchAppVersions()
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
                        label={`${latestAppVersion} (latest)`}
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
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel id="target-version-id">Game Audience</InputLabel>
                            <Select
                                variant="filled"
                                labelId="target-version-id"
                                label="Target Version"
                                name="targetVersion"
                                value={inAppAlert.targetVersion}
                                onChange={event =>
                                    handleSelectChange(event, inAppAlert, setInAppAlert)
                                }
                            >
                                {allAppVersions.map((version, index) => (
                                    <MenuItem key={index} value={version}>
                                        {version}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
                            multiline
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
                    onClick={() => void handleSetNewAlert()}
                >
                    Add Alert
                </Button>
            </Box>
        </Box>
    )
}

export default NotificationPage
