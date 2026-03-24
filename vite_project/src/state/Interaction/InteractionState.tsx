import { createContext } from "react";
import type {InteractionInfoState, InteractionState} from "./type.ts";

export const readInteraction = (): InteractionInfoState => {
    return {
        navigation: {
            activeAttribute: null
        },
        selection: {
            selectedOptions: []
        }
    }
}

export const LocalInteractionStateContext = createContext<InteractionState | undefined>(undefined);
