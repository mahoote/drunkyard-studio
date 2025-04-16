import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

import { Page } from '../types/page'
import { Logout } from '@mui/icons-material'
import { supabase } from '../supabaseClient'
import { AuthError } from '@supabase/supabase-js'
import { removeGameOptionsLastFetched } from '../utils/storageUtils'

interface HeaderBarProps {
    pages: Page[]
}

function HeaderBarComponent({ pages }: HeaderBarProps) {
    const handleSignOut = () => {
        const signOut = async () => {
            removeGameOptionsLastFetched()
            await supabase.auth.signOut()
        }

        signOut().catch((error: AuthError | null) => {
            console.error('Error signing out:', error?.message)
        })
    }

    return (
        <AppBar position={'static'}>
            <Toolbar>
                <Box
                    sx={{
                        flexGrow: 1,
                    }}
                >
                    <Box display="flex" alignItems="center">
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            display="flex"
                            fontFamily="monospace"
                            fontWeight={700}
                            letterSpacing=".3rem"
                            color="inherit"
                            sx={{
                                textDecoration: 'none',
                            }}
                        >
                            DRUNKYARD STUDIO
                        </Typography>

                        <Box
                            sx={{
                                ml: 2,
                                display: { xs: 'none', md: 'flex' },
                            }}
                            flexGrow={1}
                        >
                            {pages.map((page, index) => (
                                <Button
                                    key={index}
                                    component={Link}
                                    to={page.path}
                                    sx={{
                                        my: 2,
                                        color: 'white',
                                        display: 'flex',
                                    }}
                                    startIcon={page.icon}
                                >
                                    {page.name}
                                </Button>
                            ))}
                        </Box>
                    </Box>
                </Box>
                <IconButton onClick={handleSignOut} edge="end">
                    <Logout />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

export default HeaderBarComponent
