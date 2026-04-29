import {mountWidget, WIDGET_ID} from "./mountWidget";
import type {IntentDiscoveryWidgetConfig} from "./IntentDiscoveryConfig.ts";

const mount = async (el: HTMLElement, config: IntentDiscoveryWidgetConfig, storeCode: string = 'default') => {
    await mountWidget(el, config, storeCode)
}

const api = { mount };

(window as any)[`ReactEdge_${WIDGET_ID}`] = api;

export { mount };
