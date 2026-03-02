import { createContext } from "react";
import type { ActiveAttributeInfoState, ActiveAttributeState } from "./type.ts";

export const readActiveAttribute = (): ActiveAttributeInfoState => {
    return {
        attributeCode: null,
        attributeLayerState: undefined,
    }
}

export const LocalActiveAttributeStateContext = createContext<ActiveAttributeState | undefined>(undefined);
