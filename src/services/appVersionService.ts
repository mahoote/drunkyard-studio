import { supabaseFunction } from '../utils/supabaseUtils'

/**
 * Calls the edge function to get the latest app version
 */
export async function getLatestAppVersion() {
    const { data, error } = await supabaseFunction<{ latestVersion: string }>(
        'app-version/latest',
        {
            method: 'GET',
        }
    )

    if (error) {
        throw new Error('Failed to fetch latest app version. ' + error.message)
    }

    return data
}

/**
 * Calls the edge function to create a new app version
 * @param version
 */
export async function createNewAppVersion(version: string) {
    const { error } = await supabaseFunction('app-version', {
        method: 'POST',
        body: JSON.stringify({ version }),
    })

    if (error) {
        throw new Error('Failed to set new app version.' + error.message)
    }
}

/**
 * Calls the edge function to get all app versions
 */
export async function getAllAppVersions() {
    const { data, error } = await supabaseFunction<{ versions: string[] }>('app-version/all', {
        method: 'GET',
    })

    if (error) {
        throw new Error('Failed to fetch all app versions. ' + error.message)
    }

    return data
}
