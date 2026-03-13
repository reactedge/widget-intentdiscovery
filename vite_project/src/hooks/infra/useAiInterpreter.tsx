export type AiInterpretationRequest = {
    intent: {
        text: string
        signals: Record<string, Record<string, number>>
    }
    attributes: {
        code: string
        label: string
        options: {
            label: string
            value: string
            count: number
        }[]
    }[]
}

export type AiInterpretationResponse = {
    filters: Record<string, string>
}