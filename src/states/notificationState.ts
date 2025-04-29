import { InAppAlertDto } from '../types/notification'

export interface NotificationState {
    inAppAlert: InAppAlertDto
    setInAppAlert: (alert: InAppAlertDto) => void
}
