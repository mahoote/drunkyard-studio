import { Container } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'

import { Page } from '../types/page'

import HeaderBarComponent from './headerBarComponent'
import AppAlertComponent from './appAlertComponent'
import { Add, Edit } from '@mui/icons-material'

const pages: Page[] = [
    {
        name: 'New Game',
        path: '/',
        icon: <Add />,
    },
    {
        name: 'Edit Game',
        path: '/edit',
        icon: <Edit />,
    },
]

function AppLayoutComponent() {
    return (
        <div>
            <AppAlertComponent />
            <HeaderBarComponent pages={pages} />
            <Container sx={{ my: 2 }}>
                <Outlet />
            </Container>
        </div>
    )
}

export default AppLayoutComponent
