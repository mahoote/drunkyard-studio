import { NewAlertDto } from '../types/notification'
import { supabaseFunction } from '../utils/supabaseUtils'

/**
 * Calls the edge function to create a new alert.
 * @param dto
 */
export async function createNewAlert(dto: NewAlertDto) {
    const { error } = await supabaseFunction('alert', {
        method: 'POST',
        body: dto,
    })

    if (error) {
        throw new Error('Failed to set new alert. ' + error.message)
    }
}
