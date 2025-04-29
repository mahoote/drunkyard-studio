import { supabase } from '../supabaseClient'
import { FunctionInvokeOptions } from '@supabase/supabase-js'
import { SupabaseResponse } from '../types/supabaseResponse'

/**
 * Generic function to call a Supabase edge function.
 * Used so the casting to SupabaseResponse<T> is not needed in every function.
 * @param functionName
 * @param options
 */
export async function supabaseFunction<T>(
    functionName: string,
    options?: FunctionInvokeOptions
) {
    return (await supabase.functions.invoke(functionName, options)) as SupabaseResponse<T>
}
