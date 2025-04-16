import {
    ActionCardSettings,
    ActionCardSettingsTranslations,
    ActionCardTranslations,
} from '../types/newGame'
import { createActionCard, createActionCardSettings } from '../services/actionCardService'
import {
    ActionCardSettingsTranslationInsertDto,
    ActionCardTranslationInsertDto,
} from '../types/actionCardDto'
import { validString } from './inputUtils'
import { mapActionCardSettings } from './mapUtils'
import { GenericType } from '../types/genericType'

/**
 * Creates the Action Card Settings and Action Cards.
 * They will be used for one specific game.
 * @param gameId
 * @param actionCardSettingsData
 * @param actionCardInputs
 * @param actionCardSettingsTranslations
 * @param actionCardTranslations
 */
export async function createActionCardData(
    gameId: number,
    actionCardSettingsData: ActionCardSettings,
    actionCardInputs: GenericType[],
    actionCardSettingsTranslations: ActionCardSettingsTranslations,
    actionCardTranslations: ActionCardTranslations
) {
    const actionCardSettingsInsertDto = mapActionCardSettings(gameId, actionCardSettingsData)
    const settingsTranslationInsertDtos: ActionCardSettingsTranslationInsertDto[] = []

    if (actionCardSettingsData.prompt || actionCardSettingsData.isPlayerCreative) {
        settingsTranslationInsertDtos.push({
            id: actionCardSettingsTranslations['en']?.id,
            language: 'en',
            prompt: validString(actionCardSettingsData.prompt),
            player_creative_prompt: actionCardSettingsData.isPlayerCreative
                ? validString(actionCardSettingsData.playerCreativePrompt)
                : undefined,
        })

        Object.entries(actionCardSettingsTranslations).forEach(([key, translation]) => {
            if (key === 'en') return

            settingsTranslationInsertDtos.push({
                id: translation.id,
                language: key,
                prompt: validString(translation.prompt),
                player_creative_prompt: actionCardSettingsData.isPlayerCreative
                    ? validString(translation.playerCreativePrompt)
                    : undefined,
            })
        })
    }

    const settings = await createActionCardSettings(
        actionCardSettingsInsertDto,
        settingsTranslationInsertDtos
    )

    // Loop through all the languages.
    for (const [key, translation] of Object.entries(actionCardTranslations)) {
        if (key === 'en') continue

        // Loop through all the action card inputs and create the action cards.
        for (let i = 0; i < actionCardInputs.length; i++) {
            const input = actionCardInputs[i]
            const inputTranslated = translation?.[i] ?? actionCardInputs[i]

            const actionCardTranslationInsertDtos: ActionCardTranslationInsertDto[] = [
                {
                    id: input.id,
                    language: 'en',
                    value: input.name,
                },
                {
                    id: inputTranslated.id,
                    language: key,
                    value: inputTranslated.name,
                },
            ]

            await createActionCard(settings.id, actionCardTranslationInsertDtos, input.id)
        }
    }
}

/**
 * Validates the Action Card Settings data with the following rules:
 * - If the content type is "Word" then only one word per card is allowed.
 * Returns an error message if the data is invalid.
 * @param data
 * @param inputs
 */
export function isActionCardSettingsDataValid(
    data: ActionCardSettings | undefined,
    inputs: GenericType[] | undefined
): string | undefined {
    if (!data || !inputs) return undefined

    if (!data.allowSentence) {
        const moreThanOneWord = inputs.some(input => input.name.split(' ').length > 1)
        return moreThanOneWord
            ? 'Only one word per card is allowed.\nUpdate the Content Type to "Sentence" to allow multiple.'
            : undefined
    }

    return undefined
}
