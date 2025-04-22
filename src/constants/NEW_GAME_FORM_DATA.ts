import { GenericType } from '../types/genericType'
import { GameTranslations, NewGame } from '../types/newGame'
import { ActionCardSettingsTranslations, ActionCardTranslations } from '../types/actionCard'

export const initialNewGameData: NewGame = {
    activityLevel: 0,
    categoryId: 1,
    drunkLevel: 0,
    gameAudienceId: 0,
}

export const initialAccessoriesData: string[] = []

export const initialGameTypesData: string[] = []

export const drunkLevels: GenericType[] = [
    { id: 0, name: 'Tipsy' },
    { id: 1, name: 'Drunk' },
    { id: 2, name: 'Wasted' },
]
export const activityLevels: GenericType[] = [
    { id: 0, name: 'Low' },
    { id: 1, name: 'Medium' },
    { id: 2, name: 'High' },
]

export const initialGameTranslations: GameTranslations = {
    en: {
        name: '',
        descriptions: [],
    },
    no: {
        name: '',
        descriptions: [],
    },
}

export const initialActionCardSettingsTranslations: ActionCardSettingsTranslations = {
    en: {},
    no: {},
}

export const initialActionCardsTranslations: ActionCardTranslations = {
    en: [],
    no: [],
}
