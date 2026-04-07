const DEBUG = true;

export function log(...args: any[]) {
    if (DEBUG) console.log("[graphql]", ...args);
}