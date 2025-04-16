import React from 'react'
import { useNewGameStore } from '../../../../hooks/useNewGameStore'
import { useGameOptionsStore } from '../../../../hooks/useGameOptionsStore'
import { Box, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import MultilineComponent from '../../../../components/multilineComponent'
import { activityLevels, drunkLevels } from '../../../../constants/NEW_GAME_FORM_DATA'
import { getValidDescriptions } from '../../../../utils/newGameFormUtils'

const NewGameSummaryTableComponent = () => {
    const { newGame, selectedGameTypes, selectedAccessories } = useNewGameStore()

    const { gameCategories, gameAudience } = useGameOptionsStore()

    return (
        <>
            <TableHead>
                <TableRow>
                    <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>
                        New Game Summary
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                        Name
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>{newGame.name}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                        Category
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>
                        {gameCategories.find(c => c.id === newGame.categoryId)?.name}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                        Activity Level
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>
                        {activityLevels.find(a => a.id === newGame.activityLevel)?.name}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                        Drunk Level
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>
                        {drunkLevels.find(d => d.id === newGame.drunkLevel)?.name}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                        Intro Description
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>
                        <MultilineComponent text={newGame.introDescription ?? ''} />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                        Descriptions
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>
                        {getValidDescriptions(newGame.descriptions).map(
                            (description, index) => (
                                <Box component="ul" key={index} px={1}>
                                    <Box component="li">
                                        <MultilineComponent text={description} />
                                    </Box>
                                </Box>
                            )
                        )}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                        Minimum Players
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>{newGame.minPlayers}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                        Maximum Players
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>{newGame.maxPlayers}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                        Minutes
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>{newGame.minutes}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                        Game Audience
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>
                        {gameAudience.find(a => a.id === newGame.gameAudienceId)?.name}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                        Game Types
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>
                        {selectedGameTypes.map((gameType, index) => (
                            <div key={index}>{gameType}</div>
                        ))}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell sx={{ verticalAlign: 'top' }} scope="row">
                        Accessories
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>
                        {selectedAccessories.map((accessory, index) => (
                            <div key={index}>{accessory},</div>
                        ))}
                    </TableCell>
                </TableRow>
            </TableBody>
        </>
    )
}

export default NewGameSummaryTableComponent
