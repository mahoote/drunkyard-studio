import { InAppAlertDto } from '../types/notification'
import { supabaseFunction } from '../utils/supabaseUtils'

/**
 * Calls the edge function to set a new alert.
 * @param dto
 */
export async function setNewAlert(dto: InAppAlertDto) {
    const { error } = await supabaseFunction('alert', {
        method: 'POST',
        body: dto,
    })

    if (error) {
        throw new Error('Failed to set new alert. ' + error.message)
    }
}
