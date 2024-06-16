import type { IPerson } from '@/types/account';

class User implements IPerson {
  isGuest = false;
}

export default User;
