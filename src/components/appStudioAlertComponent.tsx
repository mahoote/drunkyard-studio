import React from 'react'
import { Alert } from '@mui/lab'
import { Snackbar } from '@mui/material'
import { useStudioStore } from '../hooks/useStudioStore'
import MultilineComponent from './multilineComponent'

/**
 * A simple alert component that can be used to show messages in the studio.
 * @constructor
 */
const AppStudioAlertComponent = () => {
    const { studioAlert, setStudioAlert } = useStudioStore()

    const handleCloseAlert = () => setStudioAlert({ ...studioAlert, open: false })

    return (
        <Snackbar
            open={studioAlert.open}
            autoHideDuration={studioAlert.autoHideDuration ?? 3000}
            onClose={handleCloseAlert}
            anchorOrigin={{
                vertical: studioAlert.vertical ?? 'top',
                horizontal: studioAlert.horizontal ?? 'right',
            }}
        >
            <Alert onClose={handleCloseAlert} severity={studioAlert.severity} variant="filled">
                <MultilineComponent text={studioAlert.message} />
            </Alert>
        </Snackbar>
    )
}

export default AppStudioAlertComponent
