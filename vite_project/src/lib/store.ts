export function extractStoreCode(contractUrl: string) {
    // extract store code
    const filename = contractUrl.split("/").pop() ?? "";
    const storeCode = filename.replace(/\.json$/, "");

    return storeCode;
}