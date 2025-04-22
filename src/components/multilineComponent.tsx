import React from 'react'

type MultilineComponentProps = {
    text: string
}

const MultilineComponent = ({ text }: MultilineComponentProps) => {
    return (
        <div
            dangerouslySetInnerHTML={{
                __html: text?.replace(/\n/g, '<br>'),
            }}
        />
    )
}

export default MultilineComponent
