export type AiInterpretationRequest = {
    intent: Intent
    attributes: Attribute[]
}

export type Intent = {
    text: string
    signals: Record<string, Record<string, number>>
}

export type Attribute = {
    code: string
    label: string
    options: AttributeOption[]
}

export type AttributeOption = {
    label: string
    value: string
    count: number
}

export type AiInterpretationResponse = {
    filters: Record<string, string>
}