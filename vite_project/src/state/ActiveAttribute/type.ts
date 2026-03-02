export interface ActiveAttributeInfoState {
    attributeCode: string | null
    attributeLayerState?: any
}

export interface ActiveAttributeState {
    attributeState: ActiveAttributeInfoState
    setActiveAttributeCode: (attributeCode: string | null) => void
    setAttributeLayerState: (layerState: any) => void
}
