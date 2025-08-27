import { createActionCard } from '../services/actionCardService'
import { ActionCardTranslationInsertDto } from '../types/actionCardDto'
import { validString } from './inputUtils'
import { mapActionCard } from './mapUtils'
import { ActionCard, ActionCardTranslations } from '../types/actionCard'

/**
 * Creates the Action Card Settings and Action Cards.
 * They will be used for one specific game.
 * @param gameId
 * @param actionCardTranslationsState
 * @param actionCardState
 */
export async function createActionCardData(
    gameId: number,
    actionCardTranslationsState: ActionCardTranslations,
    actionCardState?: ActionCard
) {
    if (!actionCardState) return

    const actionCardInsertDto = mapActionCard(gameId, actionCardState)
    const translationInsertDtos: ActionCardTranslationInsertDto[] = []

    const englishTranslation = actionCardTranslationsState.en

    Object.entries(actionCardTranslationsState).forEach(([key, translation]) => {
        translationInsertDtos.push({
            id: translation.id,
            language: key,
            prompt: validString(englishTranslation.prompt)
                ? validString(translation.prompt)
                : null,
            player_creative_prompt: validString(englishTranslation.playerCreativePrompt)
                ? validString(translation.playerCreativePrompt)
                : null,
            texts: translation.texts ?? [],
        })
    })

    await createActionCard(actionCardInsertDto, translationInsertDtos)
}

/**
 * Validates the Action Card Texts with the following rules:
 * - If the content type is "Word" then only one word per card is allowed.
 * Returns an error message if the data is invalid.
 * @param data
 * @param inputs
 */
export function isActionCardTextsValid(
    data?: ActionCard,
    inputs?: string[]
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
