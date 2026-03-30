import {type ReactNode, useEffect, useState} from "react";
import {loadIntentState, LocalIntentStateContext} from "./IntentState.tsx";

import type {IntentSignal, IntentEngineState, IntentStatus} from "../../integration/intent/types.ts";
import {useSystemState} from "../System/useSystemState.ts";

interface IntentStateProviderProps {
    children: ReactNode;
}

const LocalStateProvider = LocalIntentStateContext.Provider;

export const IntentStateProvider: React.FC<IntentStateProviderProps> = ({ children }) => {
    const [intentState, setIntentState] = useState<IntentEngineState>(loadIntentState());
    const { intentEngine } = useSystemState()

    const setPreference = (attributeCode: string, optionValue: string) => {
        setIntentState(prev => {
            const attributeScore = { ...(prev.attributeScore ?? {}) }

            const currentValues = { ...(attributeScore[attributeCode] ?? {}) }

            if (currentValues[optionValue]) {
                // REMOVE (toggle off)
                delete currentValues[optionValue]

                // clean empty attribute (important)
                if (Object.keys(currentValues).length === 0) {
                    delete attributeScore[attributeCode]
                } else {
                    attributeScore[attributeCode] = currentValues
                }
            } else {
                // ADD (toggle on)
                currentValues[optionValue] = 1
                attributeScore[attributeCode] = currentValues
            }

            return {
                ...prev,
                attributeScore
            }
        })
    }

    const resetPreference = () => {
        setIntentState(prev => ({
            ...prev,
            attributeScore: {}
        }))
    }

    const setIntentStatus = (status: IntentStatus) => {
        setIntentState(prev => ({
            ...prev,
            status
        }))
    }

    const setIntentText = (text: string) => {
        setIntentState(prev => ({
            ...prev,
            intentText: text
        }))
    }

    useEffect(() => {
        const handler = (event: Event) => {
            const customEvent = event as CustomEvent<IntentSignal>;

            const signal = customEvent.detail;
            intentEngine.handle(signal);
            setIntentState({ ...intentEngine.getState() });
        };

        window.addEventListener("reactedge:intent", handler);

        return () => {
            window.removeEventListener("reactedge:intent", handler);
        };
    }, [intentEngine]);

    return (
        <LocalStateProvider
            value={{
                intentState,
                setIntentText,
                setIntentStatus,
                setPreference,
                resetPreference
            }}
        >
            {children}
        </LocalStateProvider>
    );
};