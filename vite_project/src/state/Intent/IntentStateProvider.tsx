import {type ReactNode, useCallback, useEffect, useState} from "react";
import {loadIntentState, LocalIntentStateContext} from "./IntentState.tsx";

import type {
    IntentSignal,
    IntentEngineState,
    IntentStatus,
    IntentEvent
} from "../../integration/intent/types.ts";
import {useSystemState} from "../System/useSystemState.ts";
import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";
import type {MagentoLayeredNavigation} from "../../hooks/domain/useLayeredNavigation.tsx";
import {activity} from "../../activity";
import {parseFiltersFromUrl} from "../../controller/load.ts";
import {getFiltersHash} from "../../lib/attributes.ts";
import {intentPersistence} from "../../services/intentPersistence/intentPersistence.service.ts";

interface IntentStateProviderProps {
    children: ReactNode;
    config: IntentDiscoveryDataConfig;
}

const MIN_TEXT_LENGTH = 50
const LocalStateProvider = LocalIntentStateContext.Provider;

export const IntentStateProvider: React.FC<IntentStateProviderProps> = ({ children, config }) => {
    const [intentState, setIntentState] = useState<IntentEngineState>(loadIntentState());
    const { intentEngine } = useSystemState()

    function getAiReadiness(attributeLayerData: MagentoLayeredNavigation) {
        const threshold = config.ai?.matchThreshold ?? MIN_TEXT_LENGTH

        const base = attributeLayerData.baseTotalCount ?? 0
        const filtered = attributeLayerData.totalCount ?? 0

        if (!base || !filtered || base === filtered) {
            return 0
        }

        const fullCoverage = base - threshold
        const currentCoverage = filtered - threshold

        if (currentCoverage < 0) {
            return 100
        }

        const coverage = (currentCoverage) / fullCoverage
        const coveragePct = Math.round(coverage * 100)
        return coveragePct
    }

    function transition(state: IntentEngineState, event: IntentEvent): IntentEngineState {
        switch (event.type) {
            case "INTERPRETATION_STARTED":
                return { ...state,
                    intentInterpretationReady: false,
                    status: "idle"
                };
            case "INTERPRETATION_READY":
                return { ...state,
                    intentInterpretationReady: true,
                    status: "canBeInterpreted"
                };

            case "INTERPRETATION_PROCESSING":
                return { ...state,
                    intentInterpreted: true,
                    status: "suggestionProcessing" };

            case "INTERPRETATION_DONE":
                return { ...state,
                    intentInterpreted: true,
                    status: "readyToRecommend"
                };

            case "FILTER_CHANGED":
                window.dispatchEvent(
                    new CustomEvent("reactedge:filter", {
                        detail: event
                    })
                )

                return { ...state,
                    status: "filterChanged" };

            case "SUGGEST_CLICKED":
                if (state.resultCount === 0) return state;
                return { ...state, status: "suggestionProcessing" };

            case "SUGGESTION_SUCCESS":
                window.dispatchEvent(
                    new CustomEvent("reactedge:syncfilters", {
                        detail: event
                    })
                )

                sessionStorage.setItem("reactedge:suggestions", JSON.stringify({
                    intent: intentState.intentText,
                    filtersHash: getFiltersHash(event.filters),
                    recommendations: event.recommendations
                }));

                return {
                    ...state
                };

            case "SUGGESTION_LOAD":
                activity('recommendations-loaded', 'Recommendations Loaded', event.recommendations);
                window.dispatchEvent(new CustomEvent('reactedge:recommendations', {
                    detail: { recommendations: event.recommendations }
                }))

                return {
                    ...state,
                    status: "suggestionSent",
                    recommendations: event.recommendations,
                };
                break;

            case "BOOTSTRAP_FROM_PERSISTED_INTENT":
                return {
                    ...state,
                    attributeScore: event.payload.attributeScore,
                    categoryScore: event.payload.categoryScore,
                    intentInterpreted: true,
                    intentInterpretationReady: true,
                    searchReady: true,
                    status: "readyToApplyFilters",
                };
                break;

            case "SEARCH_PROCESSING":
                return { ...state, status: "suggestionProcessing", recommendations: [] };

            case "SUGGESTION_EMPTY":
                return { ...state, status: "noSuggestionFound", recommendations: [] };

            default:
                return state;
        }
    }

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

    const dispatch = useCallback((event: IntentEvent) => {
        setIntentState((prev) => transition(prev, event));
    }, []);

    useEffect(() => {
        const allowedAttributes = ["color", "size", "climate", "pattern", "style_general"];

        const filters = parseFiltersFromUrl(
            window.location.search,
            allowedAttributes
        );

        if (Object.keys(filters).length > 0) {
            intentEngine.hydrateFromFilters(filters);
            Object.entries(filters).forEach(([attribute, value]) => {
                const values = Object.keys(value)
                values.forEach(value => {
                    setPreference(attribute, value);
                })
            });
        }

        const handler = (event: Event) => {
            const customEvent = event as CustomEvent<IntentSignal>;

            const signal = customEvent.detail;
            intentEngine.handle(signal);
            setIntentState({ ...intentEngine.getState() });

            const state = intentEngine.getState()
            intentPersistence.save({
                categoryScore: state.categoryScore,
                attributeScore: state.attributeScore
            });
        };

        window.addEventListener("reactedge:intent", handler);

        return () => {
            window.removeEventListener("reactedge:intent", handler);
        };
    }, [intentEngine]);

    useEffect(() => {
        activity('intent-state', 'Intent State Update', intentState);
    }, [intentState.status])

    return (
        <LocalStateProvider
            value={{
                dispatch,
                intentState,
                getAiReadiness,
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