import {
    ActionCardSettings,
    ActionCardSettingsTranslations,
    ActionCardTranslations,
    AdvancedSettings,
} from '../types/newGame'
import { createActionCardData } from './actionCardSettingsUtils'
import { uploadImageFile } from '../services/imageService'
import { base64ToFile } from './fileUtils'
import { GenericType } from '../types/genericType'

/**
 * Creates the advanced settings data based on what the user has input.
 * @param gameId
 * @param advancedSettingsData
 * @param actionCardSettingsTranslations
 * @param actionCardTranslations
 * @param actionCardSettingsData
 * @param actionCardInputs
 */
export async function createAdvancedSettingsData(
    gameId: number,
    advancedSettingsData: AdvancedSettings,
    actionCardSettingsTranslations: ActionCardSettingsTranslations,
    actionCardTranslations: ActionCardTranslations,
    actionCardSettingsData?: ActionCardSettings,
    actionCardInputs?: GenericType[]
) {
    if (advancedSettingsData.customRulesImage) {
        const imageFile = base64ToFile(
            advancedSettingsData.customRulesImage.imageBase64,
            `game_${gameId}_custom_rules_image.${advancedSettingsData.customRulesImage.imageFileExtension}`,
            advancedSettingsData.customRulesImage.imageFileType
        )
        await uploadImageFile(imageFile, 'custom-rules-images', 'game', gameId)
    }

    if (actionCardSettingsData && actionCardInputs) {
        await createActionCardData(
            gameId,
            actionCardSettingsData,
            actionCardInputs,
            actionCardSettingsTranslations,
            actionCardTranslations
        )
    }
}
