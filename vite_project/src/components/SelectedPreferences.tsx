import type { MagentoCategory } from "../types/infra/magento/category.types.ts";
import { useActiveAttributeState } from "../state/ActiveAttribute/useActiveAttributeState.ts";
import {
    useSelectedPreferences,
} from "./selectedPreferencesUtils";


type Props = {
    categoryData: MagentoCategory;
    intent?: Record<string, any>;
};

export const SelectedPreferences = ({ categoryData, intent }: Props) => {
    const { setActiveAttributeCode } = useActiveAttributeState();

    const { selected: selectedAttributes, valueFor } =
        useSelectedPreferences(categoryData, intent);

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
