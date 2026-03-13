import { activity } from "./activity";
import { loadContract } from "./widget-runtime/lib/contractLoader.ts";
import type {
    IntentDiscoveryDataConfig,
    MagentoIntegrationName,
    ReactEdgeRuntimeConfig,
    ResolvedIntentDiscoveryConfig
} from "./domain/intent-discovery.types.ts";
import { WIDGET_ID } from "./mountWidget.tsx";

export type IntentDiscoveryTranslationsConfig = Record<string, string> | undefined;

export interface IntentDiscoveryWidgetConfig {
    /**
     * Structured banner payload.
     * Shape is banner-owned and opaque to the platform.
     */
    readonly data: IntentDiscoveryDataConfig
    readonly translations?: IntentDiscoveryTranslationsConfig
    readonly integration: {
        readonly requires: readonly MagentoIntegrationName[];
    };
}

export async function readWidgetConfig(
    hostElement: HTMLElement
): Promise<ResolvedIntentDiscoveryConfig> {

    const {storeCode, json: contract} = await loadContract(hostElement);

    const runtime = readIntegrationConfig();
    const resolved = resolveIntentDiscoveryConfig(contract, runtime, storeCode);

    activity('bootstrap', 'Config resolved', {
        data: resolved.data,
        integrations: resolved.integrations,
        translations: resolved.translations,
        storeCode
    });

    return Object.freeze(resolved);
}

export function readIntegrationConfig(): ReactEdgeRuntimeConfig {
    const configScript = document.getElementById('reactedge-runtime');

    if (!configScript) {
        throw new Error(`${WIDGET_ID} widget requires a <script id='reactedge-runtime'> block.`);
    }

    let config: ReactEdgeRuntimeConfig;
    try {
        config = JSON.parse(configScript.textContent);
    } catch {
        throw new Error(`${WIDGET_ID}: reactedge-runtime contains invalid JSON`);
    }

    if (!config.integrations?.magentoGraphql?.api) {
        throw new Error(`${WIDGET_ID}: magentoGraphql missing in reactedge-runtime`);
    }

    if (!config.integrations?.intentApi?.baseUrl) {
        throw new Error(`${WIDGET_ID}: intentApi baseUrl missing in reactedge-runtime`);
    }

    return config;
}

export function resolveIntentDiscoveryConfig(
    widget: IntentDiscoveryWidgetConfig,
    runtime: ReactEdgeRuntimeConfig,
    storeCode: string
): ResolvedIntentDiscoveryConfig {

    if (
        widget.integration?.requires?.includes('magentoGraphql') &&
        !runtime.integrations?.magentoGraphql?.api
    ) {
        throw new Error(`[${WIDGET_ID}] magentoGraphql integration required but not configured`);
    }

    return {
        data: widget.data,
        integrations: {
            magentoGraphql: runtime.integrations?.magentoGraphql,
            intentApi: runtime.integrations.intentApi
        },
        translations: widget.translations,
        storeCode
    };
}
