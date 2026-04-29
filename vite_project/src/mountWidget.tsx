import {createRoot} from "react-dom/client";
import {IntentDiscoveryWidgetWrapper} from "./IntentDiscoveryWidgetWrapper.tsx";
import {activity} from "./activity";
import {getMountedHost} from "./widget-runtime/lib/hostReader.ts";
import type {IntentDiscoveryWidgetConfig} from "./IntentDiscoveryConfig.ts";

export const WIDGET_ID = 'intentdiscovery';

export function mountWidget(hostElement: HTMLElement, config: IntentDiscoveryWidgetConfig, storeCode: string) {
    const mountedHost = getMountedHost(hostElement);

    activity('bootstrap', 'Widget mounted', hostElement);

    const root = createRoot(mountedHost);
    root.render(<IntentDiscoveryWidgetWrapper host={hostElement} rawConfig={config} storeCode={storeCode} />);
}
