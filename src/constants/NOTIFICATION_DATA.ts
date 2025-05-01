import { AlertDto, AlertTranslationsDto } from '../types/notification'
import { ALL_LANGUAGES } from './LANGUAGES'

export const initialAlert: AlertDto = {
    targetVersion: '',
}

export const initialAlertTranslations: AlertTranslationsDto = Object.fromEntries(
    ALL_LANGUAGES.map(lang => [lang, { title: '', description: '' }])
)
