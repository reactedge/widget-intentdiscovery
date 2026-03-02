import type {OptionSelection} from "../state/OptionPreference/type.ts";
import {formatRange} from "./price.ts";
import {unescapeHtml} from "./string.ts";
import type {IntentState} from "../integration/intent/types.ts";

export const getOptionLabel = (option: OptionSelection) => {
    if (option.code === 'price') {
        return formatRange(option.label)
    }

    return unescapeHtml(option.label)
}

export const getOptionQuery = (optionSelection: OptionSelection[]) => {
    const getOptionSelectionQuery = (query: string, option: OptionSelection) => {
        const optionQuery = `${option.code}=${option.value}`
        if (query === '') {
            query += `?${optionQuery}`
        } else {
            query += `&${optionQuery}`
        }

        return query
    }

    return optionSelection.reduce(getOptionSelectionQuery, '')
}

export function enrichWithIntent(attribute: any, intent: any) {
    const intentScores =
        intent?.attributeScore?.[attribute.attribute_code] || {};

    return {
        ...attribute,
        options: attribute.options.map((option: any) => {
            const score = intentScores[option.value] || 0;

            return {
                ...option,
                intentScore: score,
                isBoosted: score > 0,
            };
        }),
    };
}

export function intentToFilter(intentState: IntentState) {
    const { attributeScore } = intentState;

    const filter: Record<string, string> = {};

    for (const [attribute, options] of Object.entries(attributeScore)) {
        if (!options) continue;

        const bestOption = Object.entries(options).reduce(
            (best, current) => {
                const [value, score] = current;
                if (!best || score > best.score) {
                    return { value, score };
                }
                return best;
            },
            null as { value: string; score: number } | null
        );

        if (bestOption) {
            filter[attribute] = bestOption.value;
        }
    }

    return filter;
}