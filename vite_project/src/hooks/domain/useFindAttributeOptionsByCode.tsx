import {
    type MagentoAggregation,
    type MagentoProducts,
} from "../infra/useProductAttributeLayer.tsx";
import {enrichWithIntent} from "../../lib/option-match.ts";
import {useIntentState} from "../../state/Intent/useIntentState.ts";

export const useFindAttributeOptionsByCode = (code: string, attributeLayerData: MagentoProducts) => {
    const {intentState} = useIntentState()

    const result = attributeLayerData?.aggregations.filter((attribute: MagentoAggregation) => attribute.attribute_code === code).map((attribute) => {
        const enrichedAttribute = enrichWithIntent(attribute, intentState)
        return enrichedAttribute
    })

    return {
        totalCount: attributeLayerData?.total_count,
        attributeData: result && result?.length>0? result[0]: null
    };
}
