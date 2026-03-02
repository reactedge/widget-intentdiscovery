import { IntentEngine } from "./intent/IntentEngine.ts";

export const engine = new IntentEngine()

export function emitIntent(signal: any) {
    engine.handle(signal)
}

export function getIntentState() {
    return engine.getState()
}

export function getIntentEngine() {
    return engine
}