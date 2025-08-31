import { ActionCardInsertDto } from '../types/actionCardDto'

import { ActionCard } from '../types/actionCard'

export function mapActionCard(
    gameId: number,
    actionCardState: ActionCard
): ActionCardInsertDto {
    return {
        id: actionCardState.id,
        game_id: gameId,
        included_players:
            actionCardState.includedPlayersToggle ??
            actionCardState.includedPlayersAmount ??
            '-1',
        share_card: actionCardState.shareCard,
        unique_players: actionCardState.uniquePlayers,
        share_unique_card: actionCardState.shareUniqueCard,
        excluded_players: actionCardState.excludedPlayers,
        card_repeat: actionCardState.cardRepeat,
        card_limit:
            !actionCardState.oneCardPerPlayer &&
            actionCardState.cardLimit &&
            actionCardState.cardLimit > 0
                ? actionCardState.cardLimit
                : undefined,
        card_seconds:
            actionCardState.cardSeconds && actionCardState.cardSeconds > 0
                ? actionCardState.cardSeconds
                : undefined,
        is_auto_next: actionCardState.isAutoNext,
        player_repeat: actionCardState.playerRepeat,
        one_card_per_player: actionCardState.oneCardPerPlayer,
        allow_custom_cards: actionCardState.allowCustomCards,
        allow_sentence: actionCardState.allowSentence,
        has_overtime: actionCardState.hasOvertime,
        has_buzzer: actionCardState.hasBuzzer,
    }
}
