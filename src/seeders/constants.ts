export const DEFAULT_USERS = [
  {
    id: '770bb0df-1013-429b-9855-5d668a8b1e3f',
    name: 'Admin',
    email: 'admin@shivansh.com',
    password: 'Shivansh@2026',
    role: 'ADMIN' as const,
    is_deleted: false,
  }, {
    id: '770bb0df-1013-429b-9855-5d668a8b1e40',
    name: 'Manager',
    email: 'manager@shivansh.com',
    password: 'Manager@2026',
    role: 'MANAGER' as const,
    is_deleted: false,
  }, {
    id: '770bb0df-1013-429b-9855-5d668a8b1e41',
    name: 'Staff',
    email: 'staff@shivansh.com',
    password: 'Staff@2026',
    role: 'STAFF' as const,
    is_deleted: false,
  }
];


export const DEFAULT_PERMISSIONS = [
  {
    id: '1b2f1a8b-4e7c-4f30-a5b1-8c0c05e2fb01',
    name: 'View Dashboard',
    is_deleted: false,
  },
  {
    id: '1b2f1a8b-4e7c-4f30-a5b1-8c0c05e2fb02',
    name: 'Manage Products',
    is_deleted: false,
  },
  {
    id: '1b2f1a8b-4e7c-4f30-a5b1-8c0c05e2fb03',
    name: 'Manage Categories',
    is_deleted: false,
  },
  {
    id: '1b2f1a8b-4e7c-4f30-a5b1-8c0c05e2fb04',
    name: 'Manage Jewellery Types',
    is_deleted: false,
  },
  {
    id: '1b2f1a8b-4e7c-4f30-a5b1-8c0c05e2fb05',
    name: 'View Inquiries',
    is_deleted: false,
  },
  {
    id: '1b2f1a8b-4e7c-4f30-a5b1-8c0c05e2fb06',
    name: 'Manage Inquiries',
    is_deleted: false,
  },
  {
    id: '1b2f1a8b-4e7c-4f30-a5b1-8c0c05e2fb07',
    name: 'Manage Homepage',
    is_deleted: false,
  },
];
