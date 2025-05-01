export interface AppStudioAlert {
    open: boolean
    message: string
    severity: 'success' | 'error'
    vertical?: 'top' | 'bottom'
    horizontal?: 'left' | 'center' | 'right'
    autoHideDuration?: number
}
