import { createContext } from "react";
import type {InteractionInfoState, InteractionState} from "./type.ts";
import type {IntentEngineState} from "../../integration/intent/types.ts";

export const INTERACTION_STORAGE_KEY = 'intent-discovery-interaction';

export const readInteraction = (): InteractionInfoState => {
    const raw = localStorage.getItem(INTERACTION_STORAGE_KEY);

    const persisted = raw
        ? JSON.parse(raw)
        : null;

    return {
        navigation: {
            activeAttribute:
                persisted?.activeAttribute ?? null
        },
        selection: {
            selectedOptions: []
        }
    };
};

export function saveContext(context: IntentEngineState) {
    localStorage.setItem(INTERACTION_STORAGE_KEY, JSON.stringify(context))
}

export const LocalInteractionStateContext = createContext<InteractionState | undefined>(undefined);
