import { removeLastFetched } from './storageUtils'
import { supabase } from '../supabaseClient'

/**
 * Handles the sign-out process by removing the last fetched data and signing out from Supabase.
 * Redirects to "/" after signing out.
 */
export async function handleSignOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error('Error signing out:', error)
        localStorage.removeItem('sb-127-auth-token')
    }

    removeLastFetched()
    window.location.href = '/'
}
