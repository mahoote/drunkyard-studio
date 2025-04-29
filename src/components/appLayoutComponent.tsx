import { Container } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'

import { Page } from '../types/page'

import HeaderBarComponent from './headerBarComponent'
import AppAlertComponent from './appAlertComponent'
import { Add, Edit, NotificationAdd } from '@mui/icons-material'

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
    {
        name: 'Notifications',
        path: '/notifications',
        icon: <NotificationAdd />,
    },
]

function AppLayoutComponent() {
    return (
        <div>
            <AppAlertComponent />
            <HeaderBarComponent pages={pages} />
            <Container sx={{ my: 2, px: { xs: 2, sm: 4, lg: 0 } }} disableGutters>
                <Outlet />
            </Container>
        </div>
    )
}

export default AppLayoutComponent
