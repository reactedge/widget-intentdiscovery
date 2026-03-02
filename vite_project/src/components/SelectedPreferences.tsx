import { useActiveAttributeState } from "../state/ActiveAttribute/useActiveAttributeState.ts";
import {
    useSelectedPreferences,
} from "./selectedPreferencesUtils";
import type {MagentoProducts} from "../hooks/infra/useProductAttributeLayer.tsx";
import type {IntentState} from "../integration/intent/types.ts";


type Props = {
    attributeLayerData: MagentoProducts
    intent?: IntentState
};

export const SelectedPreferences = ({ attributeLayerData, intent }: Props) => {
    const { setActiveAttributeCode } = useActiveAttributeState();

    const { selected: selectedAttributes, valueFor } =
        useSelectedPreferences(attributeLayerData, intent);

    if (selectedAttributes.length === 0) return null;

    return (
        <div className="selected-preferences">
            <h3 className="selected-preferences__title">
                Your preference in your current visit
            </h3>
            <div className="selected-preferences__list">
                {selectedAttributes.map((attr: any) => (
                    <div
                        key={attr.attribute_code}
                        className="selected-preferences__entry"
                    >
                        <button
                            className="selected-preferences__item"
                            onClick={() => setActiveAttributeCode(attr.attribute_code)}
                        >
                            {attr.label}
                        </button>
                        <div className="selected-preferences__value">
                            {valueFor(attr.attribute_code)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
