import { useContext } from "react";
import { LocalActiveAttributeStateContext } from "./ActiveAttributeState.tsx";
import type { ActiveAttributeState } from "./type.ts";

export function useActiveAttributeState(): ActiveAttributeState {
    const context = useContext(LocalActiveAttributeStateContext);
    if (!context) {
        throw new Error("useActiveAttributeState must be used within ActiveAttributeStateProvider");
    }
    return context;
}
