import { InAppAlertDto } from '../types/notification'
import { validString } from './inputUtils'
import { validNewAppVersion } from './appVersionUtils'

/**
 * Validates that the alert object has a valid values:
 * - targetVersion, title, description
 * @param alert
 */
export function validNewAlert(alert: InAppAlertDto) {
    return (
        validNewAppVersion(alert.targetVersion) &&
        validString(alert.title) &&
        validString(alert.description)
    )
}
