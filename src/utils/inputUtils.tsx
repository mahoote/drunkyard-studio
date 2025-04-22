import React, { ChangeEvent } from 'react'
import { SelectChangeEvent } from '@mui/material'
import { GameLanguage } from '../types/language'
import { GameTranslations } from '../types/newGame'

/**
 * Updates a nested object property in the form data
 * @param event
 * @param gameTranslations
 * @param setGameTranslations
 * @param language
 */
export const handleGameTranslationChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    gameTranslations: GameTranslations,
    setGameTranslations: (translations: GameTranslations) => void,
    language: GameLanguage = 'en'
) => {
    const { name, value } = event.target

    setGameTranslations({
        ...gameTranslations,
        [language]: {
            ...gameTranslations[language],
            [name]: value,
        },
    })
}

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Updates the form data with the new value of the input field
 * @param event
 * @param formData
 * @param setFormData
 */
export const handleTextChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    formData: any,
    setFormData: React.Dispatch<React.SetStateAction<any>>
) => {
    const { name, value } = event.target
    setFormData({
        ...formData,
        [name]: value,
    })
}

/**
 * Updates the form data with the new value of the input field
 * @param event
 * @param formData
 * @param setFormData
 */
export const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    formData: any,
    setFormData: React.Dispatch<React.SetStateAction<any>>
) => {
    const { name, value } = event.target
    setFormData({
        ...formData,
        [name]: value,
    })
}

/**
 * Updates the form data with the new value of the input field
 * Converts the value to a number
 * @param event
 * @param formData
 * @param setFormData
 */
export const handleNumberChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    formData: any,
    setFormData: React.Dispatch<React.SetStateAction<any>>
) => {
    const { name, value } = event.target
    const numericValue = value === '' ? '' : Number(value)
    setFormData({
        ...formData,
        [name]: numericValue,
    })
}

/**
 * Updates the form data with the new value of the select field
 * @param event
 * @param formData
 * @param setFormData
 */
export const handleSelectChange = (
    event: SelectChangeEvent<number> | SelectChangeEvent,
    formData: any,
    setFormData: React.Dispatch<React.SetStateAction<any>>
) => {
    const { name, value } = event.target
    setFormData({
        ...formData,
        [name]: value,
    })
}

/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Removes all white spaces from the input
 * @param input
 */
export const noWhiteSpaceInput = (input: string) => {
    return input.replace(/\s/g, '')
}

/**
 * Checks that the string actually has a value, else return undefined
 * @param input
 */
export const validString = (input?: string) => {
    if (!input) return undefined

    return input.trim().length > 0 ? input : undefined
}

/**
 * Checks that the number actually has a value, else return undefined
 * @param input
 */
export const validNaturalNumber = (input?: number) => {
    if (!input) return undefined

    return input > 0 ? input : undefined
}
