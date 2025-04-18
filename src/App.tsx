import './App.css'
import React, { useEffect } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import AppLayoutComponent from './components/appLayoutComponent'
import NewGamePage from './pages/newGamePage/newGamePage'
import LoginPage from './pages/loginPage/loginPage'
import { useAuthStore } from './hooks/useAuthStore'
import PageLoaderComponent from './components/pageLoaderComponent'
import EditGamePage from './pages/editGamePage/editGamePage'

function App() {
    return (
        <Router>
            <AuthRoutes />
        </Router>
    )
}

function AuthRoutes() {
    const { initializeAuth, user, loading, error } = useAuthStore()

    useEffect(() => {
        initializeAuth()
    }, [initializeAuth])

    if (loading) {
        return <PageLoaderComponent />
    }

    return (
        <Routes>
            {user ? (
                <Route path="/" element={<AppLayoutComponent />}>
                    <Route index element={<NewGamePage />} />
                    <Route path="edit" element={<EditGamePage />} />
                    <Route path="*" element={<div>This page does not exist</div>} />
                </Route>
            ) : (
                <Route path="/" element={<LoginPage authError={error} />} />
            )}
        </Routes>
    )
}

export default App
