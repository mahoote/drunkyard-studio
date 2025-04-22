import { supabaseGame } from '../supabaseClient'
import { GenericType } from '../types/genericType'
import { SupabaseResponse } from '../types/supabaseResponse'

interface JoinedAccessory {
    id: number
    accessory_translation: { name: string }[]
}

/**
 * Gets all the accessories by joining the accessory and accessory_translation tables.
 * Returns an array of objects with the fields "id" and "name".
 */
export async function getAccessories(): Promise<GenericType[]> {
    const { data, error } = await supabaseGame
        .from('accessory')
        .select('id, accessory_translation!inner(name)')
        .eq('accessory_translation.language', 'en')

    if (error) {
        throw new Error(error.message)
    }
    if (!data) {
        return []
    }

    return data.map(
        (item: JoinedAccessory): GenericType => ({
            id: item.id,
            name: item.accessory_translation?.[0]?.name ?? '',
        })
    )
}

/**
 * Creates a row in the accessory table and its translations in the accessory_translation table.
 * @param accessoryTranslation
 */
export async function createAccessory(
    accessoryTranslation: { language: string; name: string }[]
) {
    // Validate that it is a new accessory.
    const englishName = accessoryTranslation.find(
        accessory => accessory.language === 'en'
    )?.name

    if (!englishName) {
        throw new Error('English translation is required to check existence.')
    }

    // Check if an accessory translation with the same English name already exists
    const {
        data: existingTranslation,
        error: fetchError,
    }: SupabaseResponse<{ accessory_id: number; name: string }> = await supabaseGame
        .from('accessory_translation')
        .select('accessory_id, name')
        .eq('name', englishName) // Check for the exact English name
        .eq('language', 'en') // Ensure it is the English translation
        .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
        throw new Error(
            `Error checking existing accessory translations: ${fetchError.message}`
        )
    }

    // If an English translation already exists, skip the insert
    if (existingTranslation) {
        return null
    }

    const { data, error }: SupabaseResponse<{ id: number }> = await supabaseGame
        .from('accessory')
        .insert({})
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }
    if (!data) {
        throw new Error('Error creating accessory')
    }

    try {
        for (const accessory of accessoryTranslation) {
            await createAccessoryTranslation(data, accessory)
        }
    } catch (error) {
        console.error('Error creating accessory translations:', error)
        await deleteAccessory(data.id)
    }

    return data
}

/**
 * Removes all rows in the game_has_accessory table for a specific game.
 */
export async function removeAllGameAccessories(gameId: number) {
    const { error } = await supabaseGame
        .from('game_has_accessory')
        .delete()
        .eq('game_id', gameId)

    if (error) {
        throw new Error(error.message)
    }
}

/**
 * Takes the accessory id and accessory translation and creates a row in the accessory_translation table.
 * @param data
 * @param accessory
 */
async function createAccessoryTranslation(
    data: { id: number },
    accessory: { language: string; name: string }
) {
    const translation = {
        accessory_id: data.id,
        language: accessory.language,
        name: accessory.name,
    }

    await supabaseGame.from('accessory_translation').insert(translation)
}

/**
 * Deletes an accessory by its id.
 * @param id
 */
async function deleteAccessory(id: number) {
    const { error }: SupabaseResponse<{ id: number }> = await supabaseGame
        .from('accessory')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }
}
