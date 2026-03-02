import {
    type MagentoAggregation,
    type MagentoProducts,
} from "../infra/useProductAttributeLayer.tsx";
import {enrichWithIntent} from "../../lib/option-match.ts";
import {useSystemState} from "../../state/System/useSystemState.ts";

export const useFindAttributeOptionsByCode = (code: string, attributeLayerData: MagentoProducts) => {
    const {intentState} = useSystemState()

    const result = attributeLayerData?.aggregations.filter((attribute: MagentoAggregation) => attribute.attribute_code === code).map((attribute: any) => {
        const enrichedAttribute = enrichWithIntent(attribute, intentState)
        return enrichedAttribute
    })

    return {
        totalCount: attributeLayerData?.total_count,
        attributeData: result && result?.length>0? result[0]: null
    };
}
