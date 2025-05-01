import { validString } from './inputUtils'
import { validNewAppVersion } from './appVersionUtils'
import { NewAlertDto } from '../types/notification'

/**
 * Validates that the alert object has a valid values:
 * - targetVersion, title, description
 * @param alert
 */
export function validNewAlert(alert?: NewAlertDto) {
    if (!alert) return false

    return (
        validNewAppVersion(alert.settings.targetVersion) &&
        alert.translations.every(
            translation =>
                !!validString(translation.title) && !!validString(translation.description)
        )
    )
}
