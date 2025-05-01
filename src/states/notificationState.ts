import { AlertDto, AlertTranslationsDto } from '../types/notification'

export interface NotificationState {
    alert: AlertDto
    setAlert: (alert: AlertDto) => void

    alertTranslations: AlertTranslationsDto
    setAlertTranslations: (translations: AlertTranslationsDto) => void
}
