import { create } from 'zustand'
import { NotificationState } from '../states/notificationState'
import { persist } from 'zustand/middleware'
import {
    initialInAppAlert,
    initialInAppAlertTranslations,
} from '../constants/NOTIFICATION_DATA'

export const useNotificationStore = create<NotificationState>()(
    persist(
        set => ({
            inAppAlert: initialInAppAlert,
            setInAppAlert: alert => set({ inAppAlert: alert }),

            inAppAlertTranslations: initialInAppAlertTranslations,
            setInAppAlertTranslations: translations =>
                set({ inAppAlertTranslations: translations }),
        }),
        {
            name: 'notificationsStorage',
        }
    )
)
