import React from 'react'
import { useNewGameStore } from '../../../../hooks/useNewGameStore'
import { Box, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import MultilineComponent from '../../../../components/multilineComponent'

const AdvancedSettingsSummaryTableComponent = () => {
    const {
        advancedSettingsData,
        actionCardState,
        writingSettingsData,
        gameTranslations,
        actionCardTranslationsState,
    } = useNewGameStore()

    const hasWinnerPrompt = gameTranslations.en.hasWinnerPrompt
    const customCardPrompt = actionCardTranslationsState.en?.customCardPrompt ?? ''
    const actionCardPrompt = actionCardTranslationsState.en?.actionPrompt
    const excludedPlayerPrompt = actionCardTranslationsState.en?.excludedPlayerPrompt ?? ''
    const overtimePrompt = actionCardTranslationsState.en?.overtimePrompt ?? ''
    const actionCards = actionCardTranslationsState.en.texts

    return (
        <>
            <TableHead>
                <TableRow>
                    <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>
                        Advanced Settings Summary
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                        Game End Type
                    </TableCell>
                    <TableCell>{advancedSettingsData.gameEndType}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                        Has Winner
                    </TableCell>
                    <TableCell>{advancedSettingsData.hasWinner?.toString()}</TableCell>
                </TableRow>
                {advancedSettingsData.hasWinner && (
                    <TableRow>
                        <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                            Has Winner Prompt
                        </TableCell>
                        <TableCell>{hasWinnerPrompt}</TableCell>
                    </TableRow>
                )}
                <TableRow>
                    <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                        Custom Rules Image
                    </TableCell>
                    <TableCell>
                        <Box maxWidth="30rem">
                            <Box
                                component="img"
                                src={advancedSettingsData.customRulesImage?.imageBase64}
                                alt="No image selected"
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    fontStyle: 'italic',
                                }}
                            />
                        </Box>
                    </TableCell>
                </TableRow>
            </TableBody>

            {actionCardState && (
                <>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>
                                Action Card Summary
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Players Receiving Card
                            </TableCell>
                            <TableCell>
                                {actionCardState.includedPlayersToggle === '1/1'
                                    ? 'all'
                                    : (actionCardState.includedPlayersToggle ??
                                      actionCardState.includedPlayersAmount)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Shared Card
                            </TableCell>
                            <TableCell>{actionCardState.shareCard?.toString()}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Players With Unique Card
                            </TableCell>
                            <TableCell>{actionCardState.uniquePlayers}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Share Unique Card
                            </TableCell>
                            <TableCell>
                                {actionCardState.shareUniqueCard?.toString()}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Players Without Card
                            </TableCell>
                            <TableCell>{actionCardState.excludedPlayers}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Buzzer
                            </TableCell>
                            <TableCell>{actionCardState.hasBuzzer?.toString()}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                One Card Per Player
                            </TableCell>
                            <TableCell>
                                {actionCardState.oneCardPerPlayer?.toString()}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Card Repeat
                            </TableCell>
                            <TableCell>{actionCardState.cardRepeat?.toString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Player Repeat
                            </TableCell>
                            <TableCell>{actionCardState.playerRepeat?.toString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Custom Cards
                            </TableCell>
                            <TableCell>
                                {actionCardState.allowCustomCards?.toString()}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Card Limit
                            </TableCell>
                            <TableCell>{actionCardState.cardLimit}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Is Sentence
                            </TableCell>
                            <TableCell>{actionCardState.allowSentence.toString()}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Card Time
                            </TableCell>
                            <TableCell>
                                {actionCardState.cardSeconds && (
                                    <>{actionCardState.cardSeconds} seconds</>
                                )}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Auto Next
                            </TableCell>
                            <TableCell>{actionCardState.isAutoNext?.toString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Overtime
                            </TableCell>
                            <TableCell>{actionCardState.hasOvertime?.toString()}</TableCell>
                        </TableRow>

                        {actionCardState.excludedPlayers &&
                            actionCardState.excludedPlayers.length > 0 && (
                                <TableRow>
                                    <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                        Excluded Player Prompt
                                    </TableCell>
                                    <TableCell>
                                        <MultilineComponent text={excludedPlayerPrompt} />
                                    </TableCell>
                                </TableRow>
                            )}
                        {actionCardState.hasOvertime && (
                            <TableRow>
                                <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                    Overtime Prompt
                                </TableCell>
                                <TableCell>
                                    <MultilineComponent text={overtimePrompt} />
                                </TableCell>
                            </TableRow>
                        )}
                        {actionCardState.allowCustomCards && (
                            <TableRow>
                                <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                    Custom Cards Prompt
                                </TableCell>
                                <TableCell>
                                    <MultilineComponent text={customCardPrompt} />
                                </TableCell>
                            </TableRow>
                        )}
                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Action Card Prompt
                            </TableCell>
                            <TableCell>{actionCardPrompt}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Action Cards
                            </TableCell>
                            <TableCell>
                                {actionCards?.map((input, index) => (
                                    <Box component="ul" key={index} px={1}>
                                        <Box component="li">
                                            <MultilineComponent text={input} />
                                        </Box>
                                    </Box>
                                ))}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </>
            )}

            {writingSettingsData && (
                <>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>
                                Writing Settings Summary
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Max Writes Per Player
                            </TableCell>
                            <TableCell>{writingSettingsData.writesAmount}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Writing Time
                            </TableCell>
                            <TableCell>{writingSettingsData.writeSeconds} seconds</TableCell>
                        </TableRow>
                    </TableBody>
                </>
            )}
        </>
    )
}

export default AdvancedSettingsSummaryTableComponent
