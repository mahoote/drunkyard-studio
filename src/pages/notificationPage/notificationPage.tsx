import { Box, Button, Divider, TextField } from '@mui/material'
import React, { useState } from 'react'

const NotificationPage = () => {
    const [newAppVersion, setNewAppVersion] = useState<string>('')

    const validNewAppVersion = (): boolean => {
        const regex = /^\d+\.\d+\.\d+$/
        return regex.test(newAppVersion)
    }

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <h3>New App Version</h3>
            <Box display="flex" gap={2} alignItems="center">
                <TextField
                    label="Latest v1.0.0"
                    variant="filled"
                    name="appVersion"
                    value={newAppVersion}
                    onChange={e => setNewAppVersion(e.target.value)}
                />
                <Button
                    variant="contained"
                    disabled={!validNewAppVersion()}
                    sx={{ height: '100%' }}
                >
                    Add Version
                </Button>
            </Box>
            <Divider />
        </Box>
    )
}

export default NotificationPage
