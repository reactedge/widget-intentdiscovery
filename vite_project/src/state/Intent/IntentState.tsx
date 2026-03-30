import {createContext} from "react";
import type {IntentState} from "./type.ts";
import type {IntentEngineState} from "../../integration/intent/types.ts";

const STORAGE_KEY = "reactedge.intentengine.v1"

const initialState: IntentEngineState = {
    intentText: '',
    categoryScore: {},
    attributeScore: {},
    productScore: {},
    priceAffinity: {},
    status: 'idle'
};
export function loadIntentState(): IntentEngineState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : initialState;
    } catch {
        return initialState
    }
}

export const LocalIntentStateContext = createContext<IntentState | undefined>(undefined);