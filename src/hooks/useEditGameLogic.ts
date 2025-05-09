import { useEffect, useState } from 'react'
import { getPreviewGamesByPage } from '../services/gameService'
import { GamePreviewResponse } from '../types/gameResponse'

/**
 * Fetches the games for the edit game page.
 */
export function useEditGameLogic() {
    const [games, setGames] = useState<GamePreviewResponse[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchGames = async () => {
            setLoading(true)

            const games = await getPreviewGamesByPage(0, 100)
            setGames(games)

            setLoading(false)
        }

        void fetchGames()
    }, [])

    return {
        games,
        loading,
        setLoading,
    }
}
