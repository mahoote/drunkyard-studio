import React from 'react'
import { useNewGameStore } from '../../../../hooks/useNewGameStore'
import { Box, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useActionCardStore } from '../../../../hooks/useActionCardStore'
import MultilineComponent from '../../../../components/multilineComponent'

const AdvancedSettingsSummaryTableComponent = () => {
    const {
        advancedSettingsData,
        actionCardSettingsData,
        writingSettingsData,
        gameTranslations,
        actionCardSettingsTranslations,
        actionCardTranslations,
    } = useNewGameStore()

    const { actionCardStates } = useActionCardStore()

    const hasWinnerPrompt = gameTranslations.en.hasWinnerPrompt
    const playerCreativePrompt = actionCardSettingsTranslations.en?.playerCreativePrompt ?? ''
    const actionCardPrompt = actionCardSettingsTranslations.en?.prompt
    const actionCards = actionCardTranslations.en

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

            {actionCardSettingsData && (
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
                                State
                            </TableCell>
                            <TableCell>
                                {
                                    actionCardStates.find(
                                        s => s.id === actionCardSettingsData.stateId
                                    )?.name
                                }
                            </TableCell>
                        </TableRow>
                        {actionCardSettingsData.stateId === 6 && (
                            <TableRow>
                                <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                    Exclude Players Amount
                                </TableCell>
                                <TableCell>
                                    {actionCardSettingsData.excludePlayersAmount}
                                </TableCell>
                            </TableRow>
                        )}
                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Allow Sentence
                            </TableCell>
                            <TableCell>
                                {actionCardSettingsData.allowSentence.toString()}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Limit
                            </TableCell>
                            <TableCell>{actionCardSettingsData.cardLimit}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Time
                            </TableCell>
                            <TableCell>
                                {actionCardSettingsData.cardSeconds && (
                                    <>{actionCardSettingsData.cardSeconds} seconds</>
                                )}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Auto Next
                            </TableCell>
                            <TableCell>
                                {actionCardSettingsData.isAutoNext?.toString()}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Buzzer
                            </TableCell>
                            <TableCell>
                                {actionCardSettingsData.hasBuzzer?.toString()}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Can Repeat
                            </TableCell>
                            <TableCell>
                                {actionCardSettingsData.canRepeat?.toString()}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Card Based Timer
                            </TableCell>
                            <TableCell>
                                {actionCardSettingsData.cardBasedTimer?.toString()}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                One Card Per Player
                            </TableCell>
                            <TableCell>
                                {actionCardSettingsData.oneCardPerPlayer?.toString()}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                Player Creative
                            </TableCell>
                            <TableCell>
                                {actionCardSettingsData.isPlayerCreative?.toString()}
                            </TableCell>
                        </TableRow>
                        {actionCardSettingsData.isPlayerCreative && (
                            <TableRow>
                                <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                                    Player Creative Prompt
                                </TableCell>
                                <TableCell>
                                    <MultilineComponent text={playerCreativePrompt} />
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
                                            <MultilineComponent text={input.value} />
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
