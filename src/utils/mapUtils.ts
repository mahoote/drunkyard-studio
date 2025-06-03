import { ActionCardSettingsInsertDto } from '../types/actionCardDto'

import { ActionCardSettings } from '../types/actionCard'

export function mapActionCardSettings(
    gameId: number,
    actionCardSettingsData: ActionCardSettings
): ActionCardSettingsInsertDto {
    return {
        id: actionCardSettingsData.id,
        game_id: gameId,
        state_id: actionCardSettingsData.stateId,
        card_limit:
            (actionCardSettingsData.cardLimit ?? 0) > 0
                ? actionCardSettingsData.cardLimit
                : undefined,
        card_seconds:
            (actionCardSettingsData.cardSeconds ?? 0) > 0
                ? actionCardSettingsData.cardSeconds
                : undefined,
        is_auto_next: actionCardSettingsData.isAutoNext,
        is_player_creative: actionCardSettingsData.isPlayerCreative,
        has_buzzer: actionCardSettingsData.hasBuzzer,
        allow_sentence: actionCardSettingsData.allowSentence,
        can_repeat: actionCardSettingsData.canRepeat,
        exclude_players_amount:
            actionCardSettingsData.stateId === 6
                ? actionCardSettingsData.excludePlayersAmount
                : undefined,
        one_card_per_player: actionCardSettingsData.oneCardPerPlayer,
    }
}
