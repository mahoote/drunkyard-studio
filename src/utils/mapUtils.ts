import { ActionCardInsertDto } from '../types/actionCardDto'

import { ActionCard } from '../types/actionCard'

export function mapActionCard(
    gameId: number,
    actionCardState: ActionCard
): ActionCardInsertDto {
    return {
        id: actionCardState.id,
        game_id: gameId,
        state_id: actionCardState.stateId,
        card_limit:
            (actionCardState.cardLimit ?? 0) > 0 ? actionCardState.cardLimit : undefined,
        card_seconds:
            (actionCardState.cardSeconds ?? 0) > 0 ? actionCardState.cardSeconds : undefined,
        is_auto_next: actionCardState.isAutoNext,
        is_player_creative: actionCardState.isPlayerCreative,
        has_buzzer: actionCardState.hasBuzzer,
        allow_sentence: actionCardState.allowSentence,
        can_repeat: actionCardState.canRepeat,
        exclude_players_amount:
            actionCardState.stateId === 6 ? actionCardState.excludePlayersAmount : undefined,
        one_card_per_player: actionCardState.oneCardPerPlayer,
    }
}
