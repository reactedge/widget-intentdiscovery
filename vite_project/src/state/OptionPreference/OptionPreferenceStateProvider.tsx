import {type ReactNode, useCallback} from "react";
import {useImmer} from "use-immer";
import {LocalOptionPreferenceStateContext, readActiveOption} from "./OptionPreferenceState.tsx";
import type {OptionPreferenceInfoState} from "./type.ts";
import {activity} from "../../activity";
import {emitFiltersUpdate} from "../../integration/event-handler.ts";

interface OptionPreferenceStateProviderProps {
    children: ReactNode;
}

const LocalStateProvider = LocalOptionPreferenceStateContext.Provider;

export const OptionPreferenceStateProvider: React.FC<OptionPreferenceStateProviderProps> = ({ children}) => {
    const [state, setState] = useImmer<{ optionState: OptionPreferenceInfoState }>({
        optionState : readActiveOption()
    });

    const updateState = useCallback(
        <K extends keyof OptionPreferenceInfoState>(
            key: K,
            value: OptionPreferenceInfoState[K]
        ) => {
            setState(draft => {
                draft.optionState[key] = value;
            });
        },
        []
    );

    const setActiveOptionCode = (code: string) => {
        updateState('activeOptionCode', code);
    }

    const toggleActiveOptionCode = useCallback((code: string) => {
        setState(draft => {
            if (draft.optionState['activeOptionCode']) {
                delete draft.optionState.activeOptionCode;
            } else {
                draft.optionState['activeOptionCode'] = code;
            }
        });
    }, []);

    const setOptionSelection = (
        code: string,
        attributeLabel: string,
        value: string,
        label: string
    ) => {
        setState(draft => {
            draft.optionState.optionSelection.push({
                code,
                attributeLabel,
                value,
                label
            });
        });
    };

    const toggleOptionSelection = (
        code: string,
        attributeLabel: string,
        value: string,
        label: string
    ) => {
        let action: 'select' | 'deselect' = 'select';

        setState(draft => {
            const selections = draft.optionState.optionSelection;
            const existingIndex = selections.findIndex(s => s.code === code);

            if (existingIndex !== -1) {
                const existing = selections[existingIndex];

                if (existing.value === value) {
                    selections.splice(existingIndex, 1);
                    action = 'deselect';
                    return;
                }

                selections[existingIndex] = { code, attributeLabel, value, label };
                action = 'select';
                emitFiltersUpdate(selections.map(s => ({ ...s })))
                return;
            }

            selections.push({ code, attributeLabel, value, label });
            action = 'select';

            activity('toggle-option', `Select ${code}`, {action, existingIndex, exist: selections[existingIndex], value: value});
            emitFiltersUpdate(selections.map(s => ({ ...s })))
        });

        return action;
    };

    const setActiveCategoryName = (name: string) => {
        updateState('activeCategoryName', name);
    }

    return (
        <LocalStateProvider
            value={{
                setActiveOptionCode,
                setActiveCategoryName,
                setOptionSelection,
                toggleActiveOptionCode,
                toggleOptionSelection,
                optionState: state.optionState
            }}
        >
            {children}
        </LocalStateProvider>
    );
};
