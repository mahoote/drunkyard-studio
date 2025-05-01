export interface InAppAlertDto {
    targetVersion: string
    buttonUrl?: string
}

export interface InAppAlertTranslationDto {
    title: string
    description: string
    buttonTitle?: string
}

export interface InAppAlertTranslations {
    [key: string]: InAppAlertTranslationDto
}
