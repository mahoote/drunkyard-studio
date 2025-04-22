import { AdvancedSettings } from '../types/newGame'
import { createActionCardData } from './actionCardSettingsUtils'
import { uploadImageFile } from '../services/imageService'
import { base64ToFile } from './fileUtils'
import {
    ActionCardSettings,
    ActionCardSettingsTranslations,
    ActionCardTranslations,
} from '../types/actionCard'

/**
 * Creates the advanced settings data based on what the user has input.
 * @param gameId
 * @param advancedSettingsData
 * @param actionCardSettingsTranslations
 * @param actionCardTranslations
 * @param actionCardSettingsData
 * @param deletedActionCards
 */
export async function createAdvancedSettingsData(
    gameId: number,
    advancedSettingsData: AdvancedSettings,
    actionCardSettingsTranslations: ActionCardSettingsTranslations,
    actionCardTranslations: ActionCardTranslations,
    actionCardSettingsData?: ActionCardSettings,
    deletedActionCards?: number[]
) {
    if (advancedSettingsData.customRulesImage) {
        const imageFile = base64ToFile(
            advancedSettingsData.customRulesImage.imageBase64,
            `game_${gameId}_custom_rules_image.${advancedSettingsData.customRulesImage.imageFileExtension}`,
            advancedSettingsData.customRulesImage.imageFileType
        )
        await uploadImageFile(imageFile, 'custom-rules-images', 'game', gameId)
    }

    if (actionCardSettingsData) {
        await createActionCardData(
            gameId,
            actionCardSettingsData,
            actionCardSettingsTranslations,
            actionCardTranslations,
            deletedActionCards
        )
    }
}
