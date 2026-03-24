import {useSystemState} from "../../state/System/useSystemState.ts";
import {activity} from "../../activity";

export const useCurrentIntentCategory = (enabledCategories?: string[]) => {
    const { intentEngine } = useSystemState();
    const intentState = intentEngine.getState()

    const category = intentState.currentUrl;

    activity('intent-state', 'Intent State', intentState);

    if (!category) return null;

    if (enabledCategories && !enabledCategories.includes(category)) {
        return null;
    }

    return category;
};