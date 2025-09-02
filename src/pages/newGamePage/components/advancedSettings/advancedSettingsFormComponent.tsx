import ActionCardComponent from './actionCardComponent'
import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import { GameTypeEnum } from '../../../../enums/gameTypeEnum'
import {
    initialActionCardTexts,
    initialActionCardState,
} from '../../../../constants/ACTION_CARD_DATA'
import WritingSettingsComponent from './writingSettingsComponent'
import { initialWritingSettingsData } from '../../../../constants/WRITING_SETTINGS_DATA'
import AdvancedDefaultSettingsComponent from './advancedDefaultSettingsComponent'
import { useNewGameStore } from '../../../../hooks/useNewGameStore'

function AdvancedSettingsFormComponent() {
    const {
        selectedGameTypes,
        activeFormRef,
        actionCardState,
        setActionCardDataState,
        writingSettingsData,
        setWritingSettingsData,
        setActionCardTexts,
    } = useNewGameStore()

    const includesActionCard = selectedGameTypes.includes(GameTypeEnum.ActionCard)
    const includesWriting = selectedGameTypes.includes(GameTypeEnum.Writing)

    useEffect(() => {
        if (includesActionCard) {
            if (!actionCardState) {
                setActionCardDataState(initialActionCardState)
                setActionCardTexts(initialActionCardTexts)
            }
        } else {
            setActionCardDataState(undefined)
            setActionCardTexts(undefined)
        }

        if (includesWriting) {
            if (!writingSettingsData) {
                setWritingSettingsData(initialWritingSettingsData)
            }
        } else {
            setWritingSettingsData(undefined)
        }
    }, [])

    return (
        <Box component="form" ref={activeFormRef}>
            <AdvancedDefaultSettingsComponent />
            {includesActionCard && <ActionCardComponent />}
            {includesWriting && <WritingSettingsComponent />}
        </Box>
    )
}

export default AdvancedSettingsFormComponent
