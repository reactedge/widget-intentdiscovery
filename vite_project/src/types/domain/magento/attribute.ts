import {getExcludedAttributes} from "../../../lib/attributes.ts";

export type OptionPreference = 'climate' | 'style_general' | 'price' | 'result' | (string & {})

export type MenOptionPreference = 'climate' | 'material' | 'size' | 'price' | 'result' | (string & {})


export const getNextPreferenceStep = (attributeData: any[], actionOptionCode: string, configAttributes: any[]): MenOptionPreference => {
    const excludeCodes = getExcludedAttributes(configAttributes)
    const layerAttributes = attributeData
                .filter(attribute => !excludeCodes.includes(attribute.attribute_code))
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