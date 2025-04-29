import { Box, Button, Divider, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getLatestAppVersion, setNewAppVersion } from '../../services/appVersionService'
import { validNewAppVersion } from '../../utils/appVersionUtils'
import PageLoaderComponent from '../../components/pageLoaderComponent'

const NotificationPage = () => {
    const [loading, setLoading] = useState<boolean>(true)

    const [appVersion, setAppVersion] = useState<string>('undefined')
    const [appVersionInput, setAppVersionInput] = useState<string>('')

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
            <Box display="flex" flexDirection="column" gap={2}>
                <h3>New In-App Alert</h3>
            </Box>
        </Box>
    )
}

export default NotificationPage
