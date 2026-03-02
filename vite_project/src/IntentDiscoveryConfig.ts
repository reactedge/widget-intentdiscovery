import { activity } from "./activity";
import { loadContract } from "./widget-runtime/lib/contractLoader.ts";
import type {
    IntentDiscoveryDataConfig,
    MagentoIntegrationName,
    ReactEdgeRuntimeConfig,
    ResolvedIntentDiscoveryConfig
} from "./domain/intent-discovery.types.ts";
import { WIDGET_ID } from "./mountWidget.tsx";

export interface IntentDiscoveryWidgetConfig {
    /**
     * Structured banner payload.
     * Shape is banner-owned and opaque to the platform.
     */
    readonly data: IntentDiscoveryDataConfig
    readonly translations?: Record<string, string>;
    readonly integration: {
        readonly requires: readonly MagentoIntegrationName[];
    };
}

export async function readWidgetConfig(
    hostElement: HTMLElement
): Promise<ResolvedIntentDiscoveryConfig> {

    const contract = await loadContract(hostElement);

    // allow the hosting page to supply or override the labelMap via a separate
    // <script id="intent-label-map"> block; useful for local testing or when
    // the contract endpoint doesn't include it yet.
    const labelScript = document.getElementById('intent-label-map');
    if (labelScript) {
        try {
            const overrides = JSON.parse(labelScript.textContent || "{}");
            if (overrides && typeof overrides === 'object') {
                contract.data = {
                    ...contract.data,
                    labelMap: {
                        ...(contract.data.labelMap || {}),
                        ...overrides
                    }
                } as any; // `as any` since contract is untyped JSON
            }
        } catch {
            // malformed script is ignored
            activity('bootstrap', 'labelMap parse error');
        }
    }

    const runtime = readIntegrationConfig();
    const resolved = resolveIntentDiscoveryConfig(contract, runtime);

    // configuration is now returned without emitting it as an activity event
    // (previously reported under 'Config resolved'); this avoids sending any
    // performance-related payload with the config.

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

    return config;
}

export function resolveIntentDiscoveryConfig(
    widget: IntentDiscoveryWidgetConfig,
    runtime: ReactEdgeRuntimeConfig
): ResolvedIntentDiscoveryConfig {

    if (
        widget.integration?.requires?.includes('magentoGraphql') &&
        !runtime.integrations?.magentoGraphql?.api
    ) {
        throw new Error(`[${WIDGET_ID}] googleMaps integration required but not configured`);
    }

    return {
        data: widget.data,
        integrations: {
            magentoGraphql: runtime.integrations?.magentoGraphql
        },
        translations: widget.translations
    };
}
