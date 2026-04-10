import {useEffect, useRef, useState} from "react";
import type {Props} from "../AttributeLayer.tsx";
import {useIntentState} from "../../../../state/Intent/useIntentState.ts";
import {useAskAi} from "../../../../hooks/domain/useAiInterpretation.tsx";
import {useAnalyseSearch} from "../../../../hooks/domain/useAnalyseSearch.tsx";
import {getFiltersHash} from "../../../../lib/attributes.ts";

export function useAttributeLayerController({
     intent,
     attributeLayerData,
     categoryData,
     config
 }: Props) {
    const [loading, setLoading] = useState(false);
    const { dispatch, intentState } = useIntentState();

    const askAi = useAskAi({
        intent,
        attributeLayerData,
        config,
        setLoading
    });

    const askAiRecommendations = useAnalyseSearch({
        attributeLayerData,
        categoryData,
        intentState
    });

    // --- trigger recommendations
    useEffect(() => {
        if (intentState.status === "readyToRecommend") {
            askAiRecommendations();
        }
    }, [intentState.status]);

    // --- restore session suggestions
    useEffect(() => {
        if (
            intentState.status === "suggestionLoaded" ||
            intentState.status === "readyToApplyFilters"
        ) return;

        const stored = sessionStorage.getItem("reactedge:suggestions");
        if (!stored) return;

        try {
            const parsed = JSON.parse(stored);
            const currentHash = getFiltersHash(intentState.attributeScore);

            if (parsed.filtersHash === currentHash) {
                dispatch({
                    type: "SUGGESTION_LOAD",
                    recommendations: parsed.recommendations,
                    filters: parsed.filters,
                    intent: parsed.intent
                });
            }
        } catch {
            // silent
        }
    }, [intentState.status, intentState.attributeScore]);

    // --- threshold crossing detection
    const prevRemaining = useRef<number | null>(null);

    useEffect(() => {
        const prev = prevRemaining.current;
        const current = intent.remainingChars;

        if (prev !== null && prev > 0 && current <= 0) {
            dispatch({ type: "INTERPRETATION_READY" });
        }

        prevRemaining.current = current;
    }, [intent.remainingChars]);

    // --- user action
    const handleAsk = () => {
        dispatch({ type: "INTERPRETATION_READY" });
        askAi();
    };

    // --- visibility rules
    const shouldHide =
        loading ||
        intentState.status === "suggestionProcessing" ||
        intentState.status === "readyToRecommend";

    return {
        handleAsk,
        shouldHide,
        intentState
    };
}