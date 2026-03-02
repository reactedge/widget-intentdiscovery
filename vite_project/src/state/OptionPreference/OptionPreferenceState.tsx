import {createContext} from "react";
import type {OptionPreferenceInfoState, OptionPreferenceState} from "./type.ts";

export const readActiveOption = (): OptionPreferenceInfoState => {
    const baseState: OptionPreferenceInfoState = {
        optionSelection: [],
        activeOptionCode: '',
        activeCategoryName: ''
    };

    return baseState
};

export const LocalOptionPreferenceStateContext = createContext<OptionPreferenceState | undefined>(undefined);