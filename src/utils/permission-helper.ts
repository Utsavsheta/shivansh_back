import { DEFAULT_PERMISSIONS } from '../seeders/constants';

type SupportedRole = 'ADMIN' | 'MANAGER' | 'STAFF' | 'USER' | 'INSTRUCTOR' | string;

const byName = (names: string[]) =>
    DEFAULT_PERMISSIONS.filter(p => names.includes(p.name)).map(p => p.id);

export const getDefaultPermissionIdsForRole = (role: SupportedRole): string[] => {
    const normalized = (role || '').toString().toUpperCase();

    if (normalized === 'ADMIN') {
        return DEFAULT_PERMISSIONS.map(p => p.id);
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

