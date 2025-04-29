import { supabase } from '../supabaseClient'
import { SupabaseResponse } from '../types/supabaseResponse'

/**
 * Calls the edge function to get the latest app version
 */
export async function getLatestAppVersion() {
    const { data, error } = (await supabase.functions.invoke('app-version/latest', {
        method: 'GET',
    })) as SupabaseResponse<{ latestVersion: string }>

    if (error) {
        throw new Error('Failed to fetch latest app version. ' + error.message)
    }

    return data
}

/**
 * Calls the edge function to set a new app version
 * @param version
 */
export async function setNewAppVersion(version: string) {
    const { error } = (await supabase.functions.invoke('app-version', {
        method: 'POST',
        body: JSON.stringify({ version }),
    })) as SupabaseResponse<null>

    if (error) {
        throw new Error('Failed to set new app version.' + error.message)
    }
}
