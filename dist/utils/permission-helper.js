"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultPermissionIdsForRole = void 0;
const constants_1 = require("../seeders/constants");
const byName = (names) => constants_1.DEFAULT_PERMISSIONS.filter(p => names.includes(p.name)).map(p => p.id);
const getDefaultPermissionIdsForRole = (role) => {
    const normalized = (role || '').toString().toUpperCase();
    if (normalized === 'ADMIN') {
        return constants_1.DEFAULT_PERMISSIONS.map(p => p.id);
    }
    // Matches the screenshot defaults (checked items)
    if (normalized === 'MANAGER') {
        return byName(['View Dashboard', 'Manage Products', 'View Inquiries']);
    }
    if (normalized === 'STAFF') {
        return byName(['View Dashboard', 'View Inquiries']);
    }
    // USER/INSTRUCTOR or unknown roles: no default permissions
    return [];
};
exports.getDefaultPermissionIdsForRole = getDefaultPermissionIdsForRole;
