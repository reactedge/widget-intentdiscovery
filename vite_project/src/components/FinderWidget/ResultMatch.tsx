import { useOptionPreferenceState } from "../../state/OptionPreference/useOptionPreferenceState.ts";
import type { OptionSelection } from "../../state/OptionPreference/type.ts";
import { getOptionLabel } from "../../lib/option-match.ts";
import type { MagentoCategory } from "../../types/infra/magento/category.types.ts";
import { useFindLayeredData } from "../../hooks/domain/useFindLayeredData.tsx";
import { ErrorState } from "../global/ErrorState.tsx";
import { Spinner } from "../global/Spinner.tsx";
import { activity } from "../../activity";

interface StepFinderProps {
    categoryData: MagentoCategory
}

export const ResultMatch = ({ categoryData }: StepFinderProps) => {
    const { optionState } = useOptionPreferenceState();
    const { productData, productLoading, productError } =
        useFindLayeredData(categoryData);

    if (productError) return <ErrorState error={productError}  />;
    if (productLoading) return <Spinner />;
    if (!productData) return <Spinner />;

    activity('match', 'Search Product Result', productData);

    return (
        <div className="product-finder">
            <h3>
                You have selected (we have {parseInt(productData.total_count)} products)
            </h3>

            {optionState.optionSelection.map((option: OptionSelection) => (
                <span key={option.value}>
                    <label>{option.attributeLabel}</label>
                    <span>{getOptionLabel(option)} {option.value}</span>
                </span>
            ))}
        </div>
    );
};