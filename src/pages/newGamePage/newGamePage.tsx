import React from 'react'
import {
    addAccessoriesToGame,
    addGameTypesToGame,
    createNewGame,
} from '../../utils/newGameFormUtils'
import NewGameFormComponent from './components/newGame/newGameFormComponent'
import LinearStepperComponent from '../../components/linearStepperComponent'
import AdvancedSettingsFormComponent from './components/advancedSettings/advancedSettingsFormComponent'
import { isActionCardSettingsDataValid } from '../../utils/actionCardSettingsUtils'

import { useNewGameStore } from '../../hooks/useNewGameStore'
import { useGameOptionsStore } from '../../hooks/useGameOptionsStore'
import { Box, IconButton, Tooltip } from '@mui/material'
import { RestartAlt } from '@mui/icons-material'

import { Game } from '../../types/gameDto'
import TranslationsFormComponent from './components/translations/translationsFormComponent'
import NewGameSummaryComponent from './components/summary/newGameSummaryComponent'
import { deleteNewGame } from '../../services/gameService'
import { createAdvancedSettingsData } from '../../utils/advancedSettingsUtils'
import { useAlertStore } from '../../hooks/useAlertStore'

/**
 * Mostly logic regarding the new game form.
 * Builds the different steps in the form.
 * @constructor
 */
function NewGamePage() {
    const {
        resetStore,
        newGame,
        gameTranslations,
        selectedGameTypes,
        actionCardSettingsData,
        activeFormRef,
        advancedSettingsData,
        formStepIndex,
        setFormStepIndex,
        actionCardSettingsTranslations,
        actionCardTranslations,
        deletedActionCards,
    } = useNewGameStore()

    const { gameTypes, accessories } = useGameOptionsStore()

    const { setAlert } = useAlertStore()

    const handleResetForm = (reloadPage: boolean = true) => {
        resetStore()
        if (reloadPage) window.location.reload()
    }

    const submitForm = async () => {
        let createdGame: Game | null = null

        const isUpdatingGame = newGame.id !== undefined

        try {
            createdGame = await createNewGame(newGame, advancedSettingsData, gameTranslations)
        } catch (error) {
            console.error('Submit form:', error)
            setAlert({
                open: true,
                message: 'Failed to create new game. Please try again.',
                severity: 'error',
                autoHideDuration: 5000,
            })
            setFormStepIndex(0)
            return
        }

        if (!createdGame) return

        try {
            // Add accessories and game types
            await addAccessoriesToGame(accessories, createdGame.id, gameTranslations)
            await addGameTypesToGame(selectedGameTypes, gameTypes, createdGame.id)

            // Add advanced settings
            await createAdvancedSettingsData(
                createdGame.id,
                advancedSettingsData,
                actionCardSettingsTranslations,
                actionCardTranslations,
                actionCardSettingsData,
                deletedActionCards
            )

            setAlert({
                open: true,
                message: `"${createdGame?.name}"\nGame Id=${createdGame?.id}\nCreated successfully!`,
                severity: 'success',
                autoHideDuration: 4000,
            })
            handleResetForm(false)
        } catch (error) {
            console.error('Failed to create game:', error)
            setAlert({
                open: true,
                message: 'Failed to complete game creation. Please try again.',
                severity: 'error',
                autoHideDuration: 5000,
            })
            setFormStepIndex(0)

            if (!isUpdatingGame) {
                // Clean up by deleting the created game
                try {
                    await deleteNewGame(createdGame.id)
                } catch (cleanupError) {
                    console.error('Failed to delete game:', cleanupError)
                    setFormStepIndex(0)
                }
            }
        }
    }

    return (
        <Box>
            <Box display="flex" justifyContent="center" mb={1}>
                <Tooltip title="Restart form.">
                    <IconButton aria-label="reset" onClick={() => handleResetForm()}>
                        <RestartAlt />
                    </IconButton>
                </Tooltip>
            </Box>
            <LinearStepperComponent
                steps={[
                    {
                        label: 'New Game',
                        content: <NewGameFormComponent />,
                    },
                    {
                        label: 'Advanced Settings',
                        content: <AdvancedSettingsFormComponent />,
                        customValidation: () =>
                            isActionCardSettingsDataValid(
                                actionCardSettingsData,
                                actionCardTranslations.en
                            ),
                    },
                    {
                        label: 'Translations',
                        content: <TranslationsFormComponent />,
                    },
                    {
                        label: 'Summary',
                        content: <NewGameSummaryComponent />,
                    },
                ]}
                formStepIndex={formStepIndex}
                setFormStepIndex={setFormStepIndex}
                onFinnish={() => void submitForm()}
                onReset={handleResetForm}
                isFormValid={() => {
                    if (activeFormRef?.current) {
                        if (activeFormRef.current.checkValidity()) {
                            return true
                        } else {
                            activeFormRef.current.reportValidity()
                            return false
                        }
                    }
                    return true
                }}
            />
        </Box>
    )
}

export default NewGamePage
