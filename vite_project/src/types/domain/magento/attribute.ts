import type {MagentoAggregation} from "../../../hooks/infra/useProductAttributeLayer.tsx";

export type OptionPreference = 'climate' | 'style_general' | 'price' | 'result' | (string & {})

export type MenOptionPreference = 'climate' | 'material' | 'size' | 'price' | 'result' | (string & {})


export const getNextPreferenceStep = (attributeData: MagentoAggregation[], actionOptionCode: string, configAttributes: string[]): MenOptionPreference => {
    const layerAttributes = attributeData
                .filter(attribute => !configAttributes.includes(attribute.attribute_code))
                .map(attribute => attribute.attribute_code)

    if (actionOptionCode === "") {
        return layerAttributes[0]
    }

    let index = 0
    for (let i = 0; i< layerAttributes.length; i++) {
        if (actionOptionCode === layerAttributes[i]) {
            index = i
            break
        }
    }

    if (layerAttributes[index+1]) {
        return layerAttributes[index+1]
    }

    return 'result'
}