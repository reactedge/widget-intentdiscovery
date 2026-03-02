
export interface OptionSelection {
    code: string
    attributeLabel: string
    value: string
    label: string
}

export interface OptionPreferenceInfoState {
    activeCategoryName: string
    optionSelection: OptionSelection[],
    activeOptionCode?: string
}

export type OptionLabelMap = Map<string, Map<string, string>>

export interface OptionPreferenceState {
    optionState: OptionPreferenceInfoState,
    setActiveOptionCode: (code: string) => void
    toggleActiveOptionCode: (code: string) => void
    setOptionSelection: (code: string, attributeLabel: string, value: string, label: string) => void
    toggleOptionSelection: (code: string, attributeLabel: string, value: string, label: string) => 'select' | 'deselect'
    setActiveCategoryName: (name: string) => void
}

