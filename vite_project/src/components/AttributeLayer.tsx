import type { MagentoCategory } from "../types/infra/magento/category.types.ts";
import { useFindAttributeLayer } from "../hooks/domain/useFindAttributeLayer.tsx";
import { Spinner } from "./global/Spinner.tsx";
import { ErrorState } from "./global/ErrorState.tsx";
import { SelectedPreferences } from "./SelectedPreferences.tsx";

type Props = {
    categoryData: MagentoCategory;
    intent?: Record<string, any>;
};

export const AttributeLayer = ({ categoryData, intent }: Props) => {
    const { attributeLayerData, attributeLayerLoading, attributeLayerError } =
        useFindAttributeLayer(categoryData);

    if (attributeLayerLoading) return <Spinner />;
    if (attributeLayerError) return <ErrorState />;
    if (!attributeLayerData) return null;

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

    return (
        <>
            <SelectedPreferences categoryData={categoryData} intent={intent} />
            <div className="finder">
                <div className="step-finder">
                    {attributeLayerData?.aggregations?.map((attr: any) => (
                        <div key={attr.attribute_code} className="choice-tile">
                            <span
                                className={`choice-tile__label ${isAttributeSelected(attr.attribute_code) ? 'choice-tile__label--selected' : ''}`}
                            >
                                {attr.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
