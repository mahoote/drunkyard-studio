/**
 * Makes sure that the input is a valid version number (x.x.x)
 * @param input
 */
export function validNewAppVersion(input: string) {
    const regex = /^\d+\.\d+\.\d+$/
    return regex.test(input)
}
