import {useFindAttributeOptionsByCode} from "../../hooks/domain/useFindAttributeOptionsByCode.tsx";
import {formatRange} from "../../lib/price.ts";
import type {MagentoAggregationOption, MagentoProducts} from "../../hooks/infra/useProductAttributeLayer.tsx";

interface StepFinderProps {
    attributeLayerData: MagentoProducts
}

export const StepPriceFinder = ({attributeLayerData}: StepFinderProps) => {
    const option = 'price'
    const {attributeData} = useFindAttributeOptionsByCode(option, attributeLayerData)

    const onChange = () => {
        //
    };

    return (
        <div className="step-finder">
            {attributeData?.options.map((option: MagentoAggregationOption) => (
                <label
                    key={option.value}
                    className="choice-tile"
                >
                    <input
                        type="radio"
                        name="preference"
                        value={option.value}
                        onChange={onChange}
                    />

                    <span className="choice-tile__label">
                            {formatRange(option.label)}
                        </span>
                </label>
            ))}
        </div>
    )
}
