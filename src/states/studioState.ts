import { AppStudioAlert } from '../types/studio'

export interface StudioState {
    studioAlert: AppStudioAlert
    setStudioAlert: (alert: AppStudioAlert) => void
}
