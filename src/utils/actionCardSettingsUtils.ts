import { ActionCardSettings, NewGameTranslations } from '../types/newGame'
import { createActionCard, createActionCardSettings } from '../services/actionCardService'
import {
    ActionCardSettingsInsertDto,
    ActionCardSettingsTranslationInsertDto,
    ActionCardTranslationInsertDto,
} from '../types/actionCardDto'
import { validString } from './inputUtils'

/**
 * Creates the Action Card Settings and Action Cards.
 * They will be used for one specific game.
 * @param gameId
 * @param actionCardSettingsData
 * @param actionCardInputs
 * @param newGameTranslations
 */
export async function createActionCardData(
    gameId: number,
    actionCardSettingsData: ActionCardSettings,
    actionCardInputs: string[],
    newGameTranslations: NewGameTranslations
) {
    const actionCardSettingsInsertDto: ActionCardSettingsInsertDto = {
        game_id: gameId,
        state_id: actionCardSettingsData.stateId,
        card_limit: actionCardSettingsData.cardLimit,
        card_seconds: actionCardSettingsData.cardSeconds,
        is_auto_next: actionCardSettingsData.isAutoNext,
        is_player_creative: actionCardSettingsData.isPlayerCreative,
        has_buzzer: actionCardSettingsData.hasBuzzer,
        allow_sentence: actionCardSettingsData.allowSentence,
        can_repeat: actionCardSettingsData.canRepeat,
    }

    const settingsTranslationInsertDtos: ActionCardSettingsTranslationInsertDto[] = []

    if (actionCardSettingsData.prompt || actionCardSettingsData.isPlayerCreative) {
        settingsTranslationInsertDtos.push({
            language: 'en',
            prompt: validString(actionCardSettingsData.prompt),
            player_creative_prompt: actionCardSettingsData.isPlayerCreative
                ? validString(actionCardSettingsData.playerCreativePrompt)
                : undefined,
        })

        Object.entries(newGameTranslations).forEach(([key, translation]) => {
            settingsTranslationInsertDtos.push({
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
    for (const [key, translation] of Object.entries(newGameTranslations)) {
        // Loop through all the action card inputs and create the action cards.
        for (let i = 0; i < actionCardInputs.length; i++) {
            const input = actionCardInputs[i]
            const inputTranslated = translation.actionCardInputs?.[i] ?? actionCardInputs[i]

            const actionCardTranslationInsertDtos: ActionCardTranslationInsertDto[] = [
                {
                    language: 'en',
                    value: input,
                },
                {
                    language: key,
                    value: inputTranslated,
                },
            ]

            await createActionCard(settings.id, actionCardTranslationInsertDtos)
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
    inputs: string[] | undefined
): string | undefined {
    if (!data || !inputs) return undefined

    if (!data.allowSentence) {
        const moreThanOneWord = inputs.some(input => input.split(' ').length > 1)
        return moreThanOneWord
            ? 'Only one word per card is allowed.\nUpdate the Content Type to "Sentence" to allow multiple.'
            : undefined
    }

    return undefined
}
