import { AppBar, Box, Button, Drawer, IconButton, Toolbar, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { Page } from '../types/page'
import { Logout, Menu } from '@mui/icons-material'
import { handleSignOut } from '../utils/headerUtils'

interface HeaderBarProps {
    pages: Page[]
}

/**
 * A drawer layout component for mobile devices.
 * @param pages
 * @param handleSignOut
 * @constructor
 */
function MobileMenu({ pages }: HeaderBarProps) {
    const [open, setOpen] = useState<boolean>(false)

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen)
    }

    return (
        <>
            <Button
                variant="text"
                onClick={toggleDrawer(true)}
                sx={{ color: 'white', display: { xs: 'flex', md: 'none' } }}
            >
                <Menu />
            </Button>
            <Drawer
                open={open}
                onClose={toggleDrawer(false)}
                anchor="right"
                sx={{
                    display: { xs: 'inherit', md: 'none' },
                }}
            >
                <Box display="flex" flexDirection="column" gap={3} padding={4}>
                    {pages.map((page, index) => (
                        <Link
                            key={index}
                            to={page.path}
                            style={{
                                color: 'white',
                                textDecoration: 'none',
                                textAlign: 'end',
                            }}
                        >
                            {page.name}
                        </Link>
                    ))}
                    <IconButton onClick={() => void handleSignOut()} edge="end">
                        <Logout />
                    </IconButton>
                </Box>
            </Drawer>
        </>
    )
}

/**
 * Header bar component for the application.
 * Displays the application name and navigation links + sign out button.
 * @param pages
 * @constructor
 */
function HeaderBarComponent({ pages }: HeaderBarProps) {
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
                                gap: 1,
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

                <IconButton
                    onClick={() => void handleSignOut()}
                    edge="end"
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                    }}
                >
                    <Logout />
                </IconButton>
                <MobileMenu pages={pages} />
            </Toolbar>
        </AppBar>
    )
}

export default HeaderBarComponent
