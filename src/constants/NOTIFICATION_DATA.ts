import { InAppAlertDto, InAppAlertTranslations } from '../types/notification'
import { ALL_LANGUAGES } from './LANGUAGES'

export const initialInAppAlert: InAppAlertDto = {
    targetVersion: '',
}

export const initialInAppAlertTranslations: InAppAlertTranslations = Object.fromEntries(
    ALL_LANGUAGES.map(lang => [lang, { title: '', description: '' }])
)
