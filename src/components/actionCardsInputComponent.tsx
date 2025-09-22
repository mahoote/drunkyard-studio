import { Button, Grid } from '@mui/material'
import React from 'react'
import { Add, Clear, Delete, List } from '@mui/icons-material'
import TextFieldSuggestionsComponent from './textFieldSuggestionsComponent'
import MultiInputBulkComponent from './multiInputBulkComponent'
import { noWhiteSpaceInput } from '../utils/inputUtils'
import { useNewGameStore } from '../hooks/useNewGameStore'
import { actionCardSuggestions } from '../constants/WORD_SUGGESTION_DATA'
import { ActionCardTranslations } from '../types/actionCard'

/**
 * This is a component for creating multiple input elements.
 * Is comes with the grid layout.
 * @constructor
 */
export default function ActionCardsInputComponent() {
    const {
        actionCardTranslationsState,
        actionCardState,
        setActionCardTexts,
        setActionCardTranslationsState,
    } = useNewGameStore()

    const defaultActionCardTranslation = actionCardTranslationsState.en.texts ?? []
    const isMultiline = actionCardState?.allowSentence

    const [openBulk, setOpenBulk] = React.useState<boolean>(false)
    const handleOpenBulk = () => setOpenBulk(true)
    const handleCloseBulk = () => setOpenBulk(false)

    /**
     * Updates the value of a specific input field.
     * @param newValue
     * @param index
     */
    const handleInputChange = (newValue: string, index: number) => {
        defaultActionCardTranslation[index] = newValue
        setActionCardTexts(defaultActionCardTranslation)
    }

    const addInputField = () => {
        setActionCardTexts([...defaultActionCardTranslation, ''])
    }

    /**
     * Filters out all the non-empty defaultActionCards and adds them to the array.
     * @param bulkInputs
     */
    const addBulkInputs = (bulkInputs: string[]) => {
        if (
            defaultActionCardTranslation.length === 1 &&
            defaultActionCardTranslation[0].length === 0
        ) {
            setActionCardTexts(bulkInputs)
            return
        }

        const filteredBulkInputs = bulkInputs.filter(
            bulkInput => !defaultActionCardTranslation.includes(bulkInput)
        )

        setActionCardTexts([...defaultActionCardTranslation, ...filteredBulkInputs])
    }

    /**
     * Remove entries where the default array has empty strings ("")
     * and apply that removal across all languages' texts.
     */
    const removeEmptyInputs = () => {
        const emptyIndexes = defaultActionCardTranslation
            .map((text, index) => (text === '' ? index : -1))
            .filter(i => i !== -1)

        if (emptyIndexes.length === 0) return

        const toDrop = new Set(emptyIndexes)

        const cleaned: ActionCardTranslations = Object.fromEntries(
            Object.entries(actionCardTranslationsState).map(([lang, translation]) => {
                const texts = translation.texts ?? []
                const newTexts = texts.filter((_, i) => !toDrop.has(i))
                return [lang, { ...translation, texts: newTexts }]
            })
        )

        setActionCardTranslationsState(cleaned)
    }

    /**
     * Removes all inputs from the array and adds a single empty input.
     */
    const removeAllInputs = () => {
        setActionCardTexts([''])
    }

    if (defaultActionCardTranslation.length <= 0) {
        removeAllInputs()
    }

    return (
        <>
            <MultiInputBulkComponent
                open={openBulk}
                handleClose={handleCloseBulk}
                handleAdd={bulkInputs => addBulkInputs(bulkInputs)}
            />
            <Grid container spacing={2}>
                {defaultActionCardTranslation.map((input, index) => (
                    <Grid key={index} item xs={12} sm={4}>
                        <TextFieldSuggestionsComponent
                            key={index}
                            wordSuggestions={actionCardSuggestions}
                            label={`Input ${index + 1}`}
                            name={`input-${index + 1}`}
                            variant="filled"
                            value={input}
                            setValue={(newValue: string) => {
                                let newInputValue = newValue
                                if (!isMultiline) newInputValue = noWhiteSpaceInput(newValue)
                                return handleInputChange(newInputValue, index)
                            }}
                            multiline={isMultiline}
                            required
                            fullWidth
                        />
                    </Grid>
                ))}
                <Grid
                    item
                    sm={12}
                    display="flex"
                    alignItems="center"
                    gap={1}
                    flexWrap="wrap"
                    sx={{ justifyContent: { xs: 'center', sm: 'normal' } }}
                >
                    <Button
                        variant="outlined"
                        endIcon={<Add />}
                        onClick={addInputField}
                        sx={{ width: '10rem' }}
                    >
                        New
                    </Button>
                    <Button
                        variant="outlined"
                        endIcon={<List />}
                        onClick={handleOpenBulk}
                        sx={{ width: '10rem' }}
                    >
                        Bulk
                    </Button>
                    <Button
                        variant="outlined"
                        endIcon={<Clear />}
                        onClick={removeEmptyInputs}
                        color="warning"
                    >
                        Remove empty
                    </Button>
                    <Button
                        variant="outlined"
                        endIcon={<Delete />}
                        onClick={removeAllInputs}
                        color="error"
                    >
                        Remove all
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}
