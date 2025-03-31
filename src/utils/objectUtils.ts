/**
 * Remove undefined properties from an object.
 * This makes sure that the database uses the default values for these properties.
 * @param data
 */
export function cleanUndefined<T extends object>(data: T): Partial<T> {
    const result: Partial<T> = {}
    for (const key in data) {
        if (data[key] !== undefined) {
            result[key] = data[key]
        }
    }
    return result
}
