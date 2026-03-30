export const STORAGE_KEY = "reactedge.intent.v1"

export type IntentContext = {
    version: number
    signals: Record<string, Record<string, number>>
    updatedAt: number
}

export function createEmptyContext(): IntentContext {
    return {
        version: 1,
        signals: {},
        updatedAt: Date.now()
    }
}

export function loadContext(): IntentContext | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

export function saveContext(context: IntentContext) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(context))
}