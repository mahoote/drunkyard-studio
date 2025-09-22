import { supabaseGame } from '../supabaseClient'
import { SupabaseResponse } from '../types/supabaseResponse'
import { ActionCardInsertDto, ActionCardTranslationInsertDto } from '../types/actionCardDto'
import { cleanUndefined } from '../utils/objectUtils'
import { ActionCardResponse, ActionCardTranslationResponse } from '../types/actionCardResponse'

/**
 * Creates action card settings and will be used for
 * one specific game that requires action cards.
 * @param actionCardInsertDto
 * @param translationInsertDtos
 */
export async function createActionCard(
    actionCardInsertDto: ActionCardInsertDto,
    translationInsertDtos: ActionCardTranslationInsertDto[]
) {
    const cleanActionCard = cleanUndefined(actionCardInsertDto)

    const { data, error }: SupabaseResponse<ActionCardResponse> = await supabaseGame
        .from('action_card')
        .upsert(cleanActionCard)
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    if (!data) {
        throw new Error('Error creating action card')
    }

    for (const dto of translationInsertDtos) {
        await createActionCardTranslation({
            ...dto,
            action_card_id: data.id,
        })
    }
}

/**
 * Creates the translation for the action card settings.
 * @param dto
 */
export async function createActionCardTranslation(
    dto: ActionCardTranslationInsertDto
): Promise<void> {
    const cleanTranslation = cleanUndefined(dto)

    const { error } = await supabaseGame
        .from('action_card_translation')
        .upsert(cleanTranslation)

    if (error) {
        throw new Error(error.message)
    }
}

/**
 * Fetches the action card data for a specific game.
 * @param gameId
 */
export async function getActionCard(gameId: number) {
    const { data, error }: SupabaseResponse<ActionCardResponse> = await supabaseGame
        .from('action_card')
        .select('*')
        .eq('game_id', gameId)
        .limit(1)
        .single()

    if (error && error.code === 'PGRST116' && data === null) {
        return null
    } else if (error) {
        throw new Error(error.message)
    }

    return data
}

/**
 * Fetches the action card translations for a specific action card ID.
 * @param actionCardId
 */
export async function getActionCardTranslations(actionCardId: number) {
    const { data, error }: SupabaseResponse<ActionCardTranslationResponse[]> =
        await supabaseGame
            .from('action_card_translation')
            .select('*')
            .eq('action_card_id', actionCardId)

    if (error) {
        throw new Error(error.message)
    }

    if (!data) {
        throw new Error('No action card translations found')
    }

    return data
}
