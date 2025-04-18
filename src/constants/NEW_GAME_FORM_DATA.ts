import { GenericType } from '../types/genericType'
import { NewGame } from '../types/newGame'

export const initialNewGameData: NewGame = {
    activityLevel: 0,
    categoryId: 1,
    descriptions: [],
    drunkLevel: 0,
    gameAudienceId: 0,
    maxPlayers: undefined,
    minPlayers: undefined,
    minutes: undefined,
    name: '',
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

export const initialNewGameTranslations = {
    no: {
        name: '',
        introDescription: undefined,
        descriptions: [],
        customEndGameSentence: undefined,
    },
}

export const initialActionCardSettingsTranslations = {
    no: {
        prompt: undefined,
    },
}

export const initialActionCardsTranslations = {
    no: [],
}
