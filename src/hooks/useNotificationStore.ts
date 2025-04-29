import { create } from 'zustand'
import { NotificationState } from '../states/notificationState'
import { persist } from 'zustand/middleware'
import { initialInAppAlert } from '../constants/NOTIFICATION_DATA'

export const useNotificationStore = create<NotificationState>()(
    persist(
        set => ({
            inAppAlert: initialInAppAlert,
            setInAppAlert: alert => set({ inAppAlert: alert }),
        }),
        {
            name: 'notificationsStorage',
        }
    )
)
