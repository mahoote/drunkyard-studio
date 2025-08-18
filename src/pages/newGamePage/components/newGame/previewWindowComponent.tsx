import React, { useEffect } from 'react'
import {
    Box,
    Button,
    IconButton,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material'
import { Add, Delete, MoveDown, MoveUp } from '@mui/icons-material'
import TextFieldSuggestionsComponent from '../../../../components/textFieldSuggestionsComponent'
import { actionCardSuggestions } from '../../../../constants/WORD_SUGGESTION_DATA'
import { useNewGameStore } from '../../../../hooks/useNewGameStore'
import { GameDescription } from '../../../../types/gameResponse'

interface MoveButtonsProps {
    onUp: () => void
    onDown: () => void
}

interface DeleteButtonProps {
    onClick: () => void
}

function MoveButtonsComponent({ onUp, onDown }: MoveButtonsProps) {
    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <IconButton aria-label="move-up" sx={{ width: 34, height: 34 }} onClick={onUp}>
                <MoveUp fontSize="small" />
            </IconButton>
            <IconButton aria-label="move-down" sx={{ width: 34, height: 34 }} onClick={onDown}>
                <MoveDown fontSize="small" />
            </IconButton>
        </Box>
    )
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
        setDescriptions([...descriptions, { text: '', pause: false }])
    }

    const moveDescription = (from: number, to: number) => {
        if (to < 0 || to >= descriptions.length) return

        const updatedGameTranslations = Object.fromEntries(
            Object.entries(gameTranslations).map(([lang, translation]) => {
                const desc = [...translation.descriptions]
                const [moved] = desc.splice(from, 1)
                desc.splice(to, 0, moved)
                return [lang, { ...translation, descriptions: desc }]
            })
        )

        setGameTranslations(updatedGameTranslations)
    }

    const handleMoveMessageUp = (index: number) => moveDescription(index, index - 1)

    const handleMoveMessageDown = (index: number) => moveDescription(index, index + 1)

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
            setDescriptions([{ text: '', pause: false }])
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
                            key={index}
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
                                <Box sx={{ display: { xs: 'flex', lg: 'none' } }}>
                                    <MoveButtonsComponent
                                        onUp={() => handleMoveMessageUp(index)}
                                        onDown={() => handleMoveMessageDown(index)}
                                    />
                                </Box>
                            </Box>
                            <Box display="flex" gap={2}>
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
                            <Box sx={{ display: { xs: 'none', lg: 'flex' } }}>
                                <MoveButtonsComponent
                                    onUp={() => handleMoveMessageUp(index)}
                                    onDown={() => handleMoveMessageDown(index)}
                                />
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
