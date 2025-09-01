import React, { useState } from 'react'
import { Box, TextField, Typography } from '@mui/material'
import { useNewGameStore } from '../../../../hooks/useNewGameStore'
import { getFractionAmount } from '../../../../utils/numberUtils'

/**
 * Shows a preview of the distribution of cards based on the current action card state.
 *
 * Displays a grid of player boxes, color-coded to represent included, unique, and excluded players.
 *
 * @component
 * @constructor
 */
const ActionCardPreviewComponent = () => {
    const { actionCardState } = useNewGameStore()

    const [playerAmount, setPlayerAmount] = useState<number>(8)

    const numbers: { id: number; color?: string }[] = Array.from(
        { length: playerAmount },
        (_, i) => ({
            id: i + 1,
        })
    )

    const includedHost = actionCardState?.includedPlayersToggle === 'host'
    const includedPlayersString = includedHost
        ? '1'
        : (actionCardState?.includedPlayersToggle ??
          actionCardState?.includedPlayersAmount ??
          '0')

    const uniquePlayersString = actionCardState?.uniquePlayers ?? '0'
    const excludedPlayersString = actionCardState?.excludedPlayers ?? '0'

    const includedPlayers = getFractionAmount(includedPlayersString, numbers.length)
    const uniquePlayers = getFractionAmount(uniquePlayersString, includedPlayers)
    const excludedPlayers = getFractionAmount(excludedPlayersString, includedPlayers)

    /**
     * Color coding:
     * - Excluded players: Red (#834240)
     * - Unique players: Yellow (#BD8955)
     * - Included players: Blue (#2E3E4D)
     * - Remaining players: Default background color (background.default)
     */
    const coloredNumbers = numbers.map((n, index) => {
        if (!includedHost) {
            // Excluded players are always at the start
            if (index < excludedPlayers) {
                return { ...n, color: '#834240' }
            }

            // Unique players are always at the end of the included players
            const uniqueNumbers = includedPlayers - uniquePlayers
            // console.log({ includedPlayers, uniquePlayers, uniqueNumbers })

            if (index < includedPlayers && index >= uniqueNumbers) {
                return { ...n, color: '#BD8955' }
            }
        }

        // Included players are in the middle
        let color = 'background.default'

        if (index < includedPlayers) {
            if (includedHost) color = '#2E4D3B'
            else color = '#2E3E4D'
        }
        return { ...n, color }
    })

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
            bgcolor="grey.900"
            borderRadius={2}
            flexDirection="column"
            paddingY={3}
            gap={3}
        >
            <Typography variant="h6">Visual Representation</Typography>
            <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2}>
                {coloredNumbers.map(n => (
                    <Box
                        key={n.id}
                        padding={3}
                        borderRadius={2}
                        bgcolor={n.color}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        P{n.id}
                    </Box>
                ))}
            </Box>
            <TextField
                sx={{ marginTop: 2 }}
                label="Player Amount"
                type="number"
                size="small"
                inputProps={{ min: 0 }}
                value={playerAmount}
                onChange={event => setPlayerAmount(Number(event.target.value))}
            />
        </Box>
    )
}

export default ActionCardPreviewComponent
