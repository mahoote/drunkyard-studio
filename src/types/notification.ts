export interface AlertDto {
    targetVersion: string
    buttonUrl?: string
}

export interface AlertTranslationDto {
    language?: string
    title: string
    description: string
    buttonTitle?: string
}

export interface AlertTranslationsDto {
    [key: string]: AlertTranslationDto
}

export interface NewAlertDto {
    settings: AlertDto
    translations: AlertTranslationDto[]
}
