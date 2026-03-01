import type { MagentoCategory } from "../types/infra/magento/category.types.ts";
import { useFindAttributeLayer } from "../hooks/domain/useFindAttributeLayer.tsx";

type Props = {
    categoryData: MagentoCategory;
    intent?: Record<string, any>;
};

export const SelectedPreferences = ({ categoryData, intent }: Props) => {
    const { attributeLayerData } = useFindAttributeLayer(categoryData);

    const isAttributeSelected = (attributeCode: string): boolean => {
        // Check if attribute is in attributeScore
        if (intent?.attributeScore && attributeCode in intent.attributeScore) {
            return true;
        }

        // Check if this is the price attribute and priceAffinity has been set
        if (attributeCode === 'price' && intent?.priceAffinity &&
            Object.keys(intent.priceAffinity).length > 0) {
            return true;
        }

        return false;
    };

    const selectedAttributes = attributeLayerData?.aggregations?.filter((attr: any) =>
        isAttributeSelected(attr.attribute_code)
    ) || [];

    if (selectedAttributes.length === 0) return null;

    const renderValue = (attributeCode: string) => {
        // attribute scores
        if (intent?.attributeScore && intent.attributeScore[attributeCode]) {
            const entries = Object.entries(intent.attributeScore[attributeCode] as Record<string, number>);
            return entries.map(([val, count]) => `${val} (${count})`).join(', ');
        }

        // price affinity case
        if (attributeCode === 'price' && intent?.priceAffinity) {
            const { min, max, avg } = intent.priceAffinity;
            const parts = [];
            if (min !== undefined) parts.push(`min: ${min}`);
            if (max !== undefined) parts.push(`max: ${max}`);
            if (avg !== undefined) parts.push(`avg: ${avg}`);
            return parts.join(', ');
        }

        return '';
    };

    return (
        <div className="selected-preferences">
            <h3 className="selected-preferences__title">Your preference in your current visit</h3>
            <div className="selected-preferences__list">
                {selectedAttributes.map((attr: any) => (
                    <div key={attr.attribute_code} className="selected-preferences__entry">
                        <button className="selected-preferences__item">
                            {attr.label}
                        </button>
                        <div className="selected-preferences__value">
                            {renderValue(attr.attribute_code)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
