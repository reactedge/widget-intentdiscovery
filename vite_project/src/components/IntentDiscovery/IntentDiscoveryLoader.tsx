import {useFindAttributeLayer} from "../../hooks/domain/useFindAttributeLayer.tsx";
import {ErrorState} from "../global/ErrorState.tsx";
import type {IntentDiscoveryDataConfig} from "../../domain/intent-discovery.types.ts";
import {Spinner} from "../global/Spinner.tsx";
import type {CategoryData} from "../../types/infra/magento/category.types.ts";
import {activity} from "../../activity";
import {IntentDiscoveryLayout} from "./IntentDiscoveryLayout.tsx";

type LoaderProps = {
    config: IntentDiscoveryDataConfig
    categoryData: CategoryData
}

export const IntentDiscoveryLoader = ({ config, categoryData }: LoaderProps) => {

    const { attributeLayerData, attributeLayerLoading, attributeLayerError } =
        useFindAttributeLayer(categoryData)

    if (attributeLayerLoading) return <Spinner />
    if (attributeLayerError) return <ErrorState error={attributeLayerError} />
    if (!attributeLayerData) return null

    activity('attribute-layer', 'Attribute Layer', attributeLayerData);

    return (
        <IntentDiscoveryLayout
            config={config}
            categoryData={categoryData}
            attributeLayerData={attributeLayerData}
        />
    )
}