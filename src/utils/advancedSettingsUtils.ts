import { AdvancedSettings } from '../types/newGame'
import { uploadImageFile } from '../services/imageService'
import { base64ToFile } from './fileUtils'

/**
 * Formats the custom rules image before uploading it.
 * @param gameId
 * @param advancedSettingsData
 */
export async function uploadCustomRulesImage(
    gameId: number,
    advancedSettingsData: AdvancedSettings
) {
    if (!advancedSettingsData.customRulesImage) return

    const imageFile = base64ToFile(
        advancedSettingsData.customRulesImage.imageBase64,
        `game_${gameId}_custom_rules_image.${advancedSettingsData.customRulesImage.imageFileExtension}`,
        advancedSettingsData.customRulesImage.imageFileType
    )
    await uploadImageFile(imageFile, 'custom-rules-images', 'game', gameId)
}
