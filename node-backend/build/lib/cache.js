"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stableHash = stableHash;
function stableHash(obj) {
    return require("crypto")
        .createHash("sha256")
        .update(JSON.stringify(obj))
        .digest("hex");
}
//# sourceMappingURL=cache.js.map