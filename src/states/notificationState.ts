import { InAppAlertDto, InAppAlertTranslations } from '../types/notification'

export interface NotificationState {
    inAppAlert: InAppAlertDto
    setInAppAlert: (alert: InAppAlertDto) => void

    inAppAlertTranslations: InAppAlertTranslations
    setInAppAlertTranslations: (translations: InAppAlertTranslations) => void
}
