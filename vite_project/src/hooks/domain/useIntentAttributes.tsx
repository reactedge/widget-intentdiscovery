import {useSystemState} from "../../state/System/useSystemState.ts";

export function useFindIntentProducts() {
    const {intentState} = useSystemState()
    const intentAttributes = Object.keys(intentState.attributeScore)

    // function buildProductAttributeFields(attributes: string[]): string {
    //     return attributes.map(attr => `
    //         ${attr}
    //       `).join("\n")
    // }
    return intentAttributes.join("\n")
}