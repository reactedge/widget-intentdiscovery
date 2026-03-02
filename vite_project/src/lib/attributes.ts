import type {ConfigAttribute} from "../domain/intent-discovery.types.ts";

export function getExcludedAttributes(attributes: ConfigAttribute[]) {
    return attributes
        .filter(a => a.excludeFromLayer !== false)
        .map(a => a.code);
}