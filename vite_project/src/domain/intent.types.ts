export type IntentControllerState = {
    text: string
    setIntent: (text: string) => void
    shouldSearch: boolean
    confirmIntent: () => void
    isIntentValid: boolean
}
