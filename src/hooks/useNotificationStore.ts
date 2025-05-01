import { create } from 'zustand'
import { NotificationState } from '../states/notificationState'
import { persist } from 'zustand/middleware'
import { initialAlert, initialAlertTranslations } from '../constants/NOTIFICATION_DATA'

export const useNotificationStore = create<NotificationState>()(
    persist(
        set => ({
            alert: initialAlert,
            setAlert: alert => set({ alert: alert }),

            alertTranslations: initialAlertTranslations,
            setAlertTranslations: translations => set({ alertTranslations: translations }),
        }),
        {
            name: 'notificationsStorage',
        }
    )
)
