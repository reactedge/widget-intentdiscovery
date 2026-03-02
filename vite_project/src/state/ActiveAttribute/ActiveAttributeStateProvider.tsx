import { type ReactNode, useState } from "react";
import { LocalActiveAttributeStateContext, readActiveAttribute } from "./ActiveAttributeState.tsx";
import type { ActiveAttributeInfoState } from "./type.ts";

interface ActiveAttributeStateProviderProps {
    children: ReactNode;
}

const LocalStateProvider = LocalActiveAttributeStateContext.Provider;

export const ActiveAttributeStateProvider: React.FC<ActiveAttributeStateProviderProps> = ({ children }) => {
    const [attributeState, setAttributeState] = useState<ActiveAttributeInfoState>(readActiveAttribute());

    const setActiveAttributeCode = (attributeCode: string | null) => {
        setAttributeState((s) => ({ ...s, attributeCode }));
    }

    const setAttributeLayerState = (layerState: any) => {
        setAttributeState((s) => ({ ...s, attributeLayerState: layerState }));
    }

    return (
        <LocalStateProvider
            value={{
                setActiveAttributeCode,
                setAttributeLayerState,
                attributeState
            }}
        >
            {children}
        </LocalStateProvider>
    );
};
