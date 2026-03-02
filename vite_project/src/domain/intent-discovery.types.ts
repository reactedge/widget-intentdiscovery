/* -------------------- */
/* Runtime              */
/* -------------------- */

export interface ReactEdgeRuntimeConfig {
    readonly integrations: ReactEdgeRuntimeIntegrations;
}

export interface ReactEdgeRuntimeIntegrations {
    readonly magentoGraphql: {
        readonly api: string;
    };
}

/* -------------------- */
/* Resolved Config      */
/* -------------------- */

export interface ResolvedIntentDiscoveryConfig {
    readonly data: IntentDiscoveryDataConfig;
    readonly integrations: ReactEdgeRuntimeIntegrations;
    readonly translations: IntentDiscoveryTranslationsConfig
}

export type IntentDiscoveryTranslationsConfig = Record<string, string> | undefined;

export type MagentoIntegrationName = 'magentoGraphql';

export type ConfigAttribute = {
    code: string;
    excludeFromLayer?: boolean;
}

export interface IntentDiscoveryDataConfig {
    categoryUrlKey: string;
    /**
     * Codes used to determine the order of preference steps. These attributes
     * will be **excluded** from the attribute layer display; the layer renders
     * only attributes not listed here.
     */
    attributes: ConfigAttribute[];
    /**
     * Optional mapping of step codes (usually attribute codes plus the special
     * `price`/`result` values) to labels shown in the finder UI.
     */
    labelMap?: Record<string, string>;
    ai: {
        "enabled": boolean,
        "matchThreshold": number,
        "minIntentScore": number,
        "maxProductsForAnalysis": number
    }
}