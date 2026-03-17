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

export const DEFAULT_CATEGORIES = [
  {
    id: '7c0a8b9f-2b8a-4c2c-9b54-5b2b2d5a0001',
    category_name: 'Rings',
    slug: 'rings',
    category_image_url: null,
    status: 'ACTIVE' as const,
    is_deleted: false,
  },
  {
    id: '7c0a8b9f-2b8a-4c2c-9b54-5b2b2d5a0002',
    category_name: 'Necklaces',
    slug: 'necklaces',
    category_image_url: null,
    status: 'ACTIVE' as const,
    is_deleted: false,
  },
  {
    id: '7c0a8b9f-2b8a-4c2c-9b54-5b2b2d5a0003',
    category_name: 'Earrings',
    slug: 'earrings',
    category_image_url: null,
    status: 'ACTIVE' as const,
    is_deleted: false,
  },
  {
    id: '7c0a8b9f-2b8a-4c2c-9b54-5b2b2d5a0004',
    category_name: 'Bracelets',
    slug: 'bracelets',
    category_image_url: null,
    status: 'ACTIVE' as const,
    is_deleted: false,
  },
  {
    id: '7c0a8b9f-2b8a-4c2c-9b54-5b2b2d5a0005',
    category_name: 'Pendants',
    slug: 'pendants',
    category_image_url: null,
    status: 'ACTIVE' as const,
    is_deleted: false,
  },
  {
    id: '7c0a8b9f-2b8a-4c2c-9b54-5b2b2d5a0006',
    category_name: 'Bangles',
    slug: 'bangles',
    category_image_url: null,
    status: 'INACTIVE' as const,
    is_deleted: false,
  },
];

export const DEFAULT_JEWELLERY_TYPES = [
  {
    id: 'b3e7c7c6-3f61-4c8a-8d64-0f58f8d10001',
    type_name: 'Gold',
    image_url: null,
    status: 'ACTIVE' as const,
    is_deleted: false,
  },
  {
    id: 'b3e7c7c6-3f61-4c8a-8d64-0f58f8d10002',
    type_name: 'Silver',
    image_url: null,
    status: 'ACTIVE' as const,
    is_deleted: false,
  },
  {
    id: 'b3e7c7c6-3f61-4c8a-8d64-0f58f8d10003',
    type_name: 'Diamond',
    image_url: null,
    status: 'ACTIVE' as const,
    is_deleted: false,
  },
  {
    id: 'b3e7c7c6-3f61-4c8a-8d64-0f58f8d10004',
    type_name: 'Platinum',
    image_url: null,
    status: 'ACTIVE' as const,
    is_deleted: false,
  },
  {
    id: 'b3e7c7c6-3f61-4c8a-8d64-0f58f8d10005',
    type_name: 'Rose Gold',
    image_url: null,
    status: 'ACTIVE' as const,
    is_deleted: false,
  },
  {
    id: 'b3e7c7c6-3f61-4c8a-8d64-0f58f8d10006',
    type_name: 'White Gold',
    image_url: null,
    status: 'ACTIVE' as const,
    is_deleted: false,
  },
];
