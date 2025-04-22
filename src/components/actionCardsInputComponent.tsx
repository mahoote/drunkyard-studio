import { Button, Grid } from '@mui/material'
import React from 'react'
import { Add, Clear, Delete, List } from '@mui/icons-material'
import TextFieldSuggestionsComponent from './textFieldSuggestionsComponent'
import MultiInputBulkComponent from './multiInputBulkComponent'
import { noWhiteSpaceInput } from '../utils/inputUtils'
import { ActionCardTranslation, ActionCardTranslations } from '../types/actionCard'
import { useNewGameStore } from '../hooks/useNewGameStore'
import { actionCardSuggestions } from '../constants/WORD_SUGGESTION_DATA'
import { initialActionCardsTranslations } from '../constants/NEW_GAME_FORM_DATA'

/**
 * This is a component for creating multiple input elements.
 * Is comes with the grid layout.
 * @constructor
 */
export default function ActionCardsInputComponent() {
    const {
        actionCardTranslations,
        setActionCardTranslations,
        setActionCards,
        deletedActionCards,
        setDeletedActionCards,
        actionCardSettingsData,
    } = useNewGameStore()

    const defaultActionCards = actionCardTranslations.en ?? []
    const isMultiline = actionCardSettingsData?.allowSentence

    const [openBulk, setOpenBulk] = React.useState<boolean>(false)
    const handleOpenBulk = () => setOpenBulk(true)
    const handleCloseBulk = () => setOpenBulk(false)

    if (defaultActionCards.length <= 0) {
        setActionCards([{ value: '' }])
    }

    const handleInputChange = (index: number, newValue: ActionCardTranslation) => {
        setActionCards(defaultActionCards.map((input, i) => (i === index ? newValue : input)))
    }

    const addInputField = () => {
        setActionCards([...defaultActionCards, { value: '' }])
    }

    /**
     * Filters out all the non-empty defaultActionCards and adds them to the array.
     * @param bulkInputs
     */
    const addBulkInputs = (bulkInputs: ActionCardTranslation[]) => {
        if (defaultActionCards.length === 1 && defaultActionCards[0].value === '') {
            setActionCards(bulkInputs)
            return
        }

        const filteredBulkInputs = bulkInputs.filter(
            bulkInput => !defaultActionCards.includes(bulkInput)
        )

        setActionCards([...defaultActionCards, ...filteredBulkInputs])
    }

    /**
     * First it sets all the blank defaultActionCards with an id to deleted.
     * Then just removes the blank defaultActionCards without id.
     */
    const removeEmptyInputs = () => {
        const activeTranslations: ActionCardTranslations = { ...actionCardTranslations }

        const emptyIndexes = defaultActionCards
            .map((card, index) => (card.value === '' ? index : -1))
            .filter(index => index !== -1)

        Object.entries(actionCardTranslations).forEach(([key, translation]) => {
            activeTranslations[key] = translation?.filter(
                (_, index) => !emptyIndexes.includes(index)
            )
        })

        const deletedInputs = Array.from(
            new Set(
                defaultActionCards
                    .filter(card => card.id && card.value === '')
                    .map(card => card.actionCardId as number)
            )
        )

        setActionCardTranslations(activeTranslations)
        setDeletedActionCards([...(deletedActionCards ?? []), ...deletedInputs])
    }

    const removeAllInputs = () => {
        const deletedInputs = Array.from(
            new Set(
                defaultActionCards
                    .filter(input => input.id)
                    .map(input => input.actionCardId as number)
            )
        )

        setDeletedActionCards([...(deletedActionCards ?? []), ...deletedInputs])
        setActionCardTranslations(initialActionCardsTranslations)
    }

    return (
        <>
            <MultiInputBulkComponent
                open={openBulk}
                handleClose={handleCloseBulk}
                handleAdd={bulkInputs =>
                    addBulkInputs(bulkInputs.map(input => ({ value: input })))
                }
            />
            <Grid container spacing={2}>
                {defaultActionCards.map((input, index) => (
                    <Grid key={index} item xs={12} sm={4}>
                        <TextFieldSuggestionsComponent
                            key={index}
                            wordSuggestions={actionCardSuggestions}
                            label={`Input ${index + 1}`}
                            name={`input-${index + 1}`}
                            variant="filled"
                            value={input.value}
                            setValue={(newValue: string) => {
                                let newInputValue = newValue
                                if (!isMultiline) newInputValue = noWhiteSpaceInput(newValue)
                                return handleInputChange(index, {
                                    id: input.id,
                                    value: newInputValue,
                                    actionCardId: input.actionCardId,
                                })
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
