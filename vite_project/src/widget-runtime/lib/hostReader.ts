import {injectStyles} from "../../lib/style.ts";
import {intentDiscoveryStyles} from "../../styles/intent-discovery.styles.ts";

export function getMountedHost(hostElement: HTMLElement) {
    const shadow =
        hostElement.shadowRoot || hostElement.attachShadow({ mode: "open" });

    return shadow
}

export function addCss(hostElement: HTMLElement) {
    const shadow =
        hostElement.shadowRoot || hostElement.attachShadow({ mode: "open" });

    for (const css of intentDiscoveryStyles) {
        injectStyles(shadow, css);
    }

    return shadow
}