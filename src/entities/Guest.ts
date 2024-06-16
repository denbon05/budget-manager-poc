import type { IPerson } from '@/types/account';

class Guest implements IPerson {
  isGuest = true;
}

export default Guest;
