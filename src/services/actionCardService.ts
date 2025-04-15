import { GenericType } from '../types/genericType'
import { supabaseGame } from '../supabaseClient'
import { SupabaseResponse } from '../types/supabaseResponse'
import {
    ActionCardDto,
    ActionCardSettingsDto,
    ActionCardSettingsInsertDto,
    ActionCardSettingsTranslationInsertDto,
    ActionCardTranslationInsertDto,
} from '../types/actionCardDto'
import { cleanUndefined } from '../utils/objectUtils'
import {
    ActionCardSettingsResponse,
    ActionCardSettingsTranslationResponse,
} from '../types/actionCardResponse'

/**
 * Fetches all the action card states.
 */
export async function getActionCardStates(): Promise<GenericType[]> {
    const { data, error } = await supabaseGame.from('action_card_state').select('*')

    if (error) {
        throw new Error(error.message)
    }
    return data as GenericType[]
}

/**
 * Creates action card settings and will be used for
 * one specific game that requires action cards.
 * @param actionCardSettingsInsertDto
 * @param actionCardSettingsTranslationInsertDtos
 */
export async function createActionCardSettings(
    actionCardSettingsInsertDto: ActionCardSettingsInsertDto,
    actionCardSettingsTranslationInsertDtos: ActionCardSettingsTranslationInsertDto[]
) {
    const cleanSettings = cleanUndefined(actionCardSettingsInsertDto)

    const { data, error }: SupabaseResponse<ActionCardSettingsDto> = await supabaseGame
        .from('action_card_settings')
        .insert([cleanSettings])
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    if (!data) {
        throw new Error('Error creating action card settings')
    }

    for (const actionCardSettingsTranslationInsertDto of actionCardSettingsTranslationInsertDtos) {
        await createActionCardSettingsTranslation({
            ...actionCardSettingsTranslationInsertDto,
            action_card_settings_id: data.id,
        })
    }

    return data
}

/**
 * Creates the translation for the action card settings.
 * @param actionCardSettingsTranslationInsertDto
 */
export async function createActionCardSettingsTranslation(
    actionCardSettingsTranslationInsertDto: ActionCardSettingsTranslationInsertDto
): Promise<void> {
    const cleanSettings = cleanUndefined(actionCardSettingsTranslationInsertDto)

    const { error } = await supabaseGame
        .from('action_card_settings_translation')
        .insert([cleanSettings])

    if (error) {
        throw new Error(error.message)
    }
}

/**
 * Creates an action card and adds a many-to-many relationship with the settings regarding the card.
 * @param settingsId
 * @param actionCardTranslationInsertDtos
 */
export async function createActionCard(
    settingsId: number,
    actionCardTranslationInsertDtos: ActionCardTranslationInsertDto[]
) {
    const { data, error }: SupabaseResponse<ActionCardDto> = await supabaseGame
        .from('action_card')
        .insert([{}])
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    if (!data) {
        throw new Error('Error creating action card')
    }

    // Add many-to-many relationship
    const { error: mtmError } = await supabaseGame
        .from('action_card_settings_has_action_card')
        .insert([
            {
                action_card_id: data.id,
                action_card_settings_id: settingsId,
            },
        ])

    if (mtmError) {
        throw new Error(mtmError.message)
    }

    for (const actionCardTranslationInsertDto of actionCardTranslationInsertDtos) {
        await createActionCardTranslation({
            ...actionCardTranslationInsertDto,
            action_card_id: data.id,
        })
    }
}

export async function createActionCardTranslation(
    actionCardTranslationInsertDto: ActionCardTranslationInsertDto
): Promise<void> {
    const { error } = await supabaseGame
        .from('action_card_translation')
        .insert([actionCardTranslationInsertDto])

    if (error) {
        throw new Error(error.message)
    }
}

/**
 * Fetches the action card settings for a specific game.
 * @param gameId
 */
export async function getActionCardSettings(gameId: number) {
    const { data, error }: SupabaseResponse<ActionCardSettingsResponse> = await supabaseGame
        .from('action_card_settings')
        .select('*')
        .eq('game_id', gameId)
        .single()

    if (error && error.code === 'PGRST116') {
        return null
    } else if (error) {
        console.error(new Error(error.message))
        return null
    }

    return data
}

/**
 * Fetches the action card settings translations for a specific settings ID.
 * @param settingsId
 */
export async function getActionCardSettingsTranslations(settingsId: number) {
    const { data, error }: SupabaseResponse<ActionCardSettingsTranslationResponse[]> =
        await supabaseGame
            .from('action_card_settings_translation')
            .select('*')
            .eq('action_card_settings_id', settingsId)

    if (error) {
        console.error(new Error(error.message))
        return []
    }

    if (!data) {
        console.error(new Error('No action card settings translations found'))
        return []
    }

    return data
}
