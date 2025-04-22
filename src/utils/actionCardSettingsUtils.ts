import {
    createActionCard,
    createActionCardSettings,
    deleteActionCards,
} from '../services/actionCardService'
import {
    ActionCardSettingsTranslationInsertDto,
    ActionCardTranslationInsertDto,
} from '../types/actionCardDto'
import { validString } from './inputUtils'
import { mapActionCardSettings } from './mapUtils'
import {
    ActionCardSettings,
    ActionCardSettingsTranslations,
    ActionCardTranslation,
    ActionCardTranslations,
} from '../types/actionCard'

/**
 * Creates the Action Card Settings and Action Cards.
 * They will be used for one specific game.
 * @param gameId
 * @param actionCardSettingsData
 * @param actionCardSettingsTranslations
 * @param actionCardTranslations
 * @param deletedActionCards
 */
export async function createActionCardData(
    gameId: number,
    actionCardSettingsData: ActionCardSettings,
    actionCardSettingsTranslations: ActionCardSettingsTranslations,
    actionCardTranslations: ActionCardTranslations,
    deletedActionCards?: number[]
) {
    const actionCardSettingsInsertDto = mapActionCardSettings(gameId, actionCardSettingsData)
    const settingsTranslationInsertDtos: ActionCardSettingsTranslationInsertDto[] = []

    Object.entries(actionCardSettingsTranslations).forEach(([key, translation]) => {
        settingsTranslationInsertDtos.push({
            id: translation.id,
            language: key,
            prompt: validString(translation.prompt),
            player_creative_prompt: actionCardSettingsData.isPlayerCreative
                ? validString(translation.playerCreativePrompt)
                : undefined,
        })
    })

    const settings = await createActionCardSettings(
        actionCardSettingsInsertDto,
        settingsTranslationInsertDtos
    )

    const actionCardArray = toTranslationInsertDtos(actionCardTranslations)

    if (deletedActionCards) {
        await deleteActionCards(deletedActionCards)
    }

    for (const actionCards of actionCardArray) {
        await createActionCard(settings.id, actionCards, actionCards[0].action_card_id)
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
    inputs: ActionCardTranslation[] | undefined
): string | undefined {
    if (!data || !inputs) return undefined

    if (!data.allowSentence) {
        const moreThanOneWord = inputs.some(input => input.value.split(' ').length > 1)
        return moreThanOneWord
            ? 'Only one word per card is allowed.\nUpdate the Content Type to "Sentence" to allow multiple.'
            : undefined
    }

    return undefined
}

export function toTranslationInsertDtos(
    translations: ActionCardTranslations
): ActionCardTranslationInsertDto[][] {
    const languages = Object.keys(translations)
    const maxLength = Math.max(...languages.map(lang => translations[lang]?.length || 0))

    return Array.from({ length: maxLength }, (_, i) => {
        return languages
            .map(language => {
                const item = translations[language]?.[i]
                if (!item) return null
                return {
                    id: item.id,
                    language,
                    value: item.value,
                    action_card_id: item.actionCardId,
                } as ActionCardTranslationInsertDto
            })
            .filter(Boolean) as ActionCardTranslationInsertDto[]
    })
}
