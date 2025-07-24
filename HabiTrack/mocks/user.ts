import { User } from '@/db/schema';

export const mockUser1: User = {
  id: 'asdfqwertyuizxcv',
  username: 'johndoe',
  name: 'John Doe',
  password: '$2a$10$syT94VQnn/TXIoNiZmMGzejcUpEOUA2aqCjzD2O5fetvBVWeESRnW',
  bio: 'This is a test user.',
  profilePicture: null,
  createdAt: '2025-06-26T19:16:14.823Z',
  modifiedAt: '2025-07-26T19:16:14.823Z',
  isDeleted: false,
};
