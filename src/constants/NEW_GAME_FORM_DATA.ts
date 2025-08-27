import { GenericType } from '../types/genericType'
import { GameTranslation, GameTranslations, NewGame } from '../types/newGame'
import { ActionCardTranslation, ActionCardTranslations } from '../types/actionCard'
import { ALL_LANGUAGES } from './LANGUAGES'

export const initialNewGameData: NewGame = {
    activityLevel: 0,
    categoryId: 1,
    drunkLevel: 0,
    gameAudienceId: 0,
}

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

export const initialGameTranslations: GameTranslations = Object.fromEntries(
    ALL_LANGUAGES.map(lang => [lang, { name: '', descriptions: [] } as GameTranslation])
)

export const initialActionCardTranslations: ActionCardTranslations = Object.fromEntries(
    ALL_LANGUAGES.map(lang => [lang, {} as ActionCardTranslation])
)
