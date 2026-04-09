import type {ResolvedIntentDiscoveryConfig} from "../domain/intent-discovery.types.ts";
import {useCurrentIntentCategory} from "../hooks/domain/useCurrentIntentCategory.tsx";
import {IntentDiscoveryWidget} from "./IntentDiscoveryWidget.tsx";
import {addCss} from "../widget-runtime/lib/hostReader.ts";
import {useLayoutEffect} from "react";

export interface Props {
    config: ResolvedIntentDiscoveryConfig
    host: HTMLElement
}
export const IntentLookup = ({ config, host }: Props) => {
    const category = useCurrentIntentCategory(config.data.enabledCategories);

    useLayoutEffect(() => {
        if (!category) return

        addCss(host);
    }, [host, category]);

    if (!category) return null;

    return (
        <IntentDiscoveryWidget config={config} categoryUrlKey={category} />
    )
}