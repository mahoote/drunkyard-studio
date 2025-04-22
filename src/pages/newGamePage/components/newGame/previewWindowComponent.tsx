import React, { useEffect } from 'react'
import {
    Box,
    Button,
    IconButton,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material'
import { Add, Delete } from '@mui/icons-material'
import TextFieldSuggestionsComponent from '../../../../components/textFieldSuggestionsComponent'
import { actionCardSuggestions } from '../../../../constants/WORD_SUGGESTION_DATA'
import { useNewGameStore } from '../../../../hooks/useNewGameStore'
import { GameDescription } from '../../../../types/gameResponse'

interface DeleteButtonProps {
    onClick: () => void
}

function DeleteButtonComponent({ onClick }: DeleteButtonProps) {
    return (
        <Box display="flex" alignItems="center" justifyContent="center">
            <IconButton aria-label="delete" sx={{ width: 34, height: 34 }} onClick={onClick}>
                <Delete fontSize="small" />
            </IconButton>
        </Box>
    )
}

export default function PreviewWindowComponent() {
    const { gameTranslations, setDescriptions, setGameTranslations } = useNewGameStore()

    const gameName = gameTranslations.en.name
    const descriptions = gameTranslations.en.descriptions

    /**
     * Updates a given description in the descriptions array.
     * @param newDescription
     * @param index
     */
    const handleDescriptionChange = (newDescription: GameDescription, index: number) => {
        const updatedDescriptions = [...descriptions]
        updatedDescriptions[index] = newDescription
        setDescriptions(updatedDescriptions)
    }

    const handleAddDescription = () => {
        setDescriptions([...descriptions, { text: '', side: 'left', pause: false }])
    }

    /**
     * Loops through all the languages and filters out the description index selected.
     * @param index
     */
    const handleRemoveDescription = (index: number) => {
        const updatedGameTranslations = Object.fromEntries(
            Object.entries(gameTranslations).map(([key, translation]) => [
                key,
                {
                    ...translation,
                    descriptions: translation.descriptions.filter((_, i) => i !== index),
                },
            ])
        )

        setGameTranslations(updatedGameTranslations)
    }

    /**
     * Adds the first description if the descriptions array is empty.
     */
    useEffect(() => {
        if (descriptions.length === 0) {
            setDescriptions([{ text: '', side: 'left', pause: false }])
        }
    }, [setDescriptions, descriptions.length])

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
            bgcolor="grey.900"
            borderRadius={2}
            flexDirection="column"
        >
            <Box
                className="container"
                borderRadius={5}
                height="30rem"
                width="100%"
                color="text.primary"
                padding={2}
            >
                <Typography variant="h6" component="div" textAlign="center" marginY={3}>
                    {gameName === '' ? 'Game Name' : gameName}
                </Typography>
                <Box
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    sx={{ overflowY: 'auto', maxHeight: '22rem' }}
                >
                    {descriptions.map((description, index) => (
                        <Box
                            sx={{
                                display: { xs: 'block', lg: 'flex' },
                                gap: 2,
                            }}
                        >
                            <Box display="flex" gap={1} width="100%">
                                <Box sx={{ display: { xs: 'none', lg: 'flex' } }}>
                                    <DeleteButtonComponent
                                        onClick={() => handleRemoveDescription(index)}
                                    />
                                </Box>
                                <TextFieldSuggestionsComponent
                                    wordSuggestions={actionCardSuggestions}
                                    placeholder={`Message ${index + 1}`}
                                    variant="filled"
                                    name="description"
                                    value={description.text}
                                    setValue={newValue =>
                                        handleDescriptionChange(
                                            { ...description, text: newValue },
                                            index
                                        )
                                    }
                                    multiline
                                    required
                                    fullWidth
                                />
                            </Box>
                            <Box display="flex" gap={2}>
                                <ToggleButtonGroup
                                    color="primary"
                                    value={description.side}
                                    exclusive
                                    onChange={(_, value: 'right' | 'left') =>
                                        handleDescriptionChange(
                                            { ...description, side: value },
                                            index
                                        )
                                    }
                                    aria-label="Platform"
                                >
                                    <ToggleButton value="left">Left</ToggleButton>
                                    <ToggleButton value="right">Right</ToggleButton>
                                </ToggleButtonGroup>
                                <ToggleButtonGroup
                                    color="primary"
                                    value={description.pause ? 'pause' : undefined}
                                    exclusive
                                    onChange={(_, value) =>
                                        handleDescriptionChange(
                                            { ...description, pause: value === 'pause' },
                                            index
                                        )
                                    }
                                    aria-label="Platform"
                                >
                                    <ToggleButton value="pause">Pause</ToggleButton>
                                </ToggleButtonGroup>
                                <Box sx={{ display: { xs: 'flex', lg: 'none' } }}>
                                    <DeleteButtonComponent
                                        onClick={() => handleRemoveDescription(index)}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    ))}
                    <Button
                        variant="outlined"
                        endIcon={<Add />}
                        onClick={handleAddDescription}
                    >
                        New Message
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}
