import { Box, Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { Add } from '@mui/icons-material'
import AppModalComponent from './appModalComponent'

type MultiInputBulkProps = {
    open: boolean
    handleClose: () => void
    handleAdd: (bulkInputs: string[]) => void
}

/**
 * Lets you type in an array of strings for quick adding of multiple inputs.
 * Just separate the strings with a comma.
 * @param open
 * @param handleClose
 * @param handleAdd
 * @constructor
 */
function MultiInputBulkComponent({ open, handleClose, handleAdd }: MultiInputBulkProps) {
    const [jsonObject, setJsonObject] = useState<string>('')

    /**
     * Converts the string to an array of strings and adds them to the inputs.
     * @param event
     */
    const handleModalAdd = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault()

        const jsonArray = jsonObject
            .split(';')
            .map(item => item.trim())
            .filter(item => item !== '')

        handleAdd(jsonArray)
        setJsonObject('')
        handleClose()
    }

    return (
        <AppModalComponent
            open={open}
            handleClose={handleClose}
            title="Action Card Bulk Mode"
            description="Paste a JSON array of action cards here."
        >
            <>
                <TextField
                    sx={{ mt: 2 }}
                    variant="outlined"
                    name="jsonObject"
                    value={jsonObject}
                    onChange={event => setJsonObject(event.target.value)}
                    multiline
                    fullWidth
                    minRows={6}
                    maxRows={18}
                />
                <Box display="flex" justifyContent="end" mt={2}>
                    <Button
                        variant="contained"
                        endIcon={<Add />}
                        onClick={handleModalAdd}
                        disabled={jsonObject.length <= 0}
                    >
                        Add
                    </Button>
                </Box>
            </>
        </AppModalComponent>
    )
}

export default MultiInputBulkComponent
