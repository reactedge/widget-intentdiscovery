import {useSystemState} from "../../state/System/useSystemState.ts";

export const useCurrentIntentCategory = (enabledCategories?: string[]) => {
    const { intentState } = useSystemState();

    const category = intentState.currentUrl;

    if (!category) return null;

    if (enabledCategories && !enabledCategories.includes(category)) {
        return null;
    }

    return category;
};