import {useIntentState} from "../../state/Intent/useIntentState.ts";
import type {AttributeFilters} from "../../integration/intent/types.ts";
import type {MagentoLayeredNavigation} from "../../hooks/domain/useLayeredNavigation.tsx";
import type {OptionLabelMap} from "../../domain/intent-discovery.types.ts";
import {useOptionLabelMap} from "../../hooks/domain/useOptionLabelMap.ts";
import type {MergedAttribute} from "../../hooks/infra/useMagentoLayeredData.tsx";
import {intentPersistence, type PersistedIntentV1} from "../../services/intentPersistence/intentPersistence.service.ts";

type Props = {
    attributeLayerData: MagentoLayeredNavigation
}

type AttributeMap = Record<string, MergedAttribute>;

export const PreviousIntent = ({attributeLayerData}: Props) => {
    const { dispatch } = useIntentState()
    const optionLabelMap = useOptionLabelMap(attributeLayerData.attributes);

    const intent = intentPersistence.load();

    if (!intent || !attributeLayerData || !attributeLayerData.attributes) return null;

    const attributeMap = Object.fromEntries(
        attributeLayerData.attributes.map(a => [a.code, a]) || []
    );

    const attributesDisplay = getAttributes(
        intent.attributeScore,
        attributeMap,
        optionLabelMap
    );

    function getAttributes(
        scores: AttributeFilters,
        attributeMap: AttributeMap,
        openLabelMap: OptionLabelMap
    ) {
        if (!scores) return [];

        return Object.entries(scores).map(([attributeCode, optionMap]) => {
            const optionValue = Object.keys(optionMap)[0]; // "204"
            const attr = attributeMap[attributeCode];
            const optionLabel = openLabelMap?.get(attributeCode)?.get(optionValue)
            if (!attr || !optionLabel) return null;

            return {
                label: attr.label,
                attributeCode,
                optionValue,
                optionLabel
            };
        });
    }

    function handleReuse() {
        dispatch({ type: "BOOTSTRAP_FROM_PERSISTED_INTENT", payload: intent as PersistedIntentV1});
    }

    return (
        <div className="intent-resume">
            <div className="intent-resume__title">
                <span>We noticed you have used these filters</span>
                <button className="intent-resume__button" onClick={handleReuse}>
                    Apply
                </button>
            </div>
            {attributesDisplay.length > 0 && (
                <div className="intent-resume__filters">
                    {attributesDisplay.filter(a => a !== null).map((a) => (
                        <span key={a.label} className="intent-resume__chip">
                            {a.optionLabel}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};