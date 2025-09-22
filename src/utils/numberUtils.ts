/**
 * Calculates the fraction of a number and rounds up to the nearest whole number.
 * If the input is a whole number (no "/"), it returns that number directly.
 * @param fractionStr - A string representing the fraction (e.g., "1/4" or "2").
 * @param total - The number to apply the fraction to.
 * @returns A number that is either the parsed whole number or the rounded-up result of (fraction * total).
 */
export function getFractionAmount(
    fractionStr: string | undefined | null,
    total: number
): number {
    if (!fractionStr) return 0

    if (!fractionStr.includes('/')) {
        const number = parseInt(fractionStr, 10)
        if (isNaN(number) || number <= 0) {
            console.error(`Invalid number: ${fractionStr}`)
            return 0
        }
        return number
    }

    const [numeratorStr, denominatorStr] = fractionStr.split('/')

    const numerator = parseInt(numeratorStr, 10)
    const denominator = parseInt(denominatorStr, 10)

    if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
        console.error(`Invalid fraction string: ${fractionStr}`)
        return 0
    }

    const result = (numerator / denominator) * total

    // If the result is exactly equal to total, return total
    if (result === total) return total

    const roundedResult = Math.round(result)

    // Ensure the result is within bounds
    if (roundedResult <= 0) return 1
    if (roundedResult >= total) return total - 1

    return roundedResult
}
