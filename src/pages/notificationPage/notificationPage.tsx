import {
    Box,
    Button,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Tooltip,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getAllAppVersions, createNewAppVersion } from '../../services/appVersionService'
import { validNewAppVersion } from '../../utils/appVersionUtils'
import PageLoaderComponent from '../../components/pageLoaderComponent'
import { useNotificationStore } from '../../hooks/useNotificationStore'
import { handleSelectChange, handleTextChange } from '../../utils/inputUtils'
import { validNewAlert } from '../../utils/notificationsUtils'
import { createNewAlert } from '../../services/alertService'
import { initialAlert, initialAlertTranslations } from '../../constants/NOTIFICATION_DATA'
import { RestartAlt } from '@mui/icons-material'
import AlertTranslationsComponent from './components/alertTranslationsComponent'
import { useStudioStore } from '../../hooks/useStudioStore'
import { NewAlertDto } from '../../types/notification'

const NotificationPage = () => {
    const { setStudioAlert } = useStudioStore()
    const { alert, setAlert, alertTranslations, setAlertTranslations } = useNotificationStore()

    const [loading, setLoading] = useState<boolean>(true)
    const [latestAppVersion, setLatestAppVersion] = useState<string>('undefined')
    const [allAppVersions, setAllAppVersions] = useState<string[]>([alert.targetVersion])
    const [appVersionInput, setAppVersionInput] = useState<string>('')
    const [newAlertDto, setNewAlertDto] = useState<NewAlertDto | undefined>()

    const fetchAppVersions = async () => {
        const allVersionsResult = await getAllAppVersions()
        const allVersions = allVersionsResult?.versions || []

        setLatestAppVersion(allVersions[0])
        setAllAppVersions(allVersions)

        if (!validNewAppVersion(alert.targetVersion)) {
            alert.targetVersion = allVersions[0]
        }
    }

    /**
     * Handles the setting of a new app version.
     * Validates the new app version and updates it if valid.
     * Fetches the latest app version after setting the new version.
     */
    const handleCreateNewAppVersion = async () => {
        if (validNewAppVersion(appVersionInput)) {
            try {
                setLoading(true)
                await createNewAppVersion(appVersionInput)
                setAppVersionInput('')
                await fetchAppVersions()
            } catch (error) {
                console.error('Error setting new app version:', error)
            } finally {
                setLoading(false)
            }
        }
    }

    /**
     * Validates that the new alert object is correct.
     * If it is, then call the edge function to create the alert, and give feedback in studio.
     * Catches if the backend failed to create.
     */
    const handleCreateNewAlert = async () => {
        if (!newAlertDto || !validNewAlert(newAlertDto)) {
            return
        }

        try {
            setLoading(true)
            await createNewAlert(newAlertDto)
            handleResetPage()
            setStudioAlert({
                open: true,
                message: `Created in-app alert successfully!`,
                severity: 'success',
                autoHideDuration: 4000,
            })
        } catch (error) {
            console.error('Error setting new alert:', error)
            setStudioAlert({
                open: true,
                message: 'Failed to create in app alert. Please try again.',
                severity: 'error',
                autoHideDuration: 5000,
            })
        } finally {
            setLoading(false)
        }
    }

    /**
     * Removes existing values.
     */
    const handleResetPage = () => {
        setAlert(initialAlert)
        setAlertTranslations(initialAlertTranslations)
        setAppVersionInput('')
    }

    /**
     * On mount, fetches existing app versions.
     */
    useEffect(() => {
        try {
            setLoading(true)
            void fetchAppVersions()
        } catch (error) {
            console.error('Error fetching app versions:', error)
            setStudioAlert({
                open: true,
                severity: 'error',
                message: 'Failed to get existing app versions.',
                autoHideDuration: 5000,
            })
        } finally {
            setLoading(false)
        }
    }, [])

    /**
     * On alert values change, create a dto for the new alert.
     */
    useEffect(() => {
        setNewAlertDto({
            settings: alert,
            translations: Object.entries(alertTranslations).map(([key, translation]) => ({
                language: key,
                title: translation.title,
                description: translation.description,
                buttonTitle: translation.buttonTitle,
            })),
        })
    }, [alert, alertTranslations])

    if (loading) {
        return <PageLoaderComponent />
    }

    return (
        <Box display="flex" flexDirection="column" gap={3}>
            <Box>
                <Box display="flex" justifyContent="center">
                    <Tooltip title="Reset this page">
                        <IconButton aria-label="reset" onClick={() => void handleResetPage()}>
                            <RestartAlt />
                        </IconButton>
                    </Tooltip>
                </Box>
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
                            onClick={() => void handleCreateNewAppVersion()}
                        >
                            Add Version
                        </Button>
                    </Box>
                    <Divider />
                </Box>
            </Box>
            <Box display="flex" flexDirection="column" gap={2} component="form">
                <h3>New In-App Alert</h3>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel id="target-version-id">Target Version</InputLabel>
                            <Select
                                variant="filled"
                                labelId="target-version-id"
                                label="Target Version"
                                name="targetVersion"
                                value={alert.targetVersion}
                                onChange={event => handleSelectChange(event, alert, setAlert)}
                            >
                                {allAppVersions.map((version, index) => (
                                    <MenuItem key={index} value={version}>
                                        {version}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Button Url"
                            variant="outlined"
                            name="buttonUrl"
                            value={alert.buttonUrl}
                            onChange={event => handleTextChange(event, alert, setAlert)}
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Divider />
                <AlertTranslationsComponent />
                <Button
                    variant="contained"
                    disabled={!validNewAlert(newAlertDto)}
                    onClick={() => void handleCreateNewAlert()}
                >
                    Add Alert
                </Button>
            </Box>
        </Box>
    )
}

export default NotificationPage
