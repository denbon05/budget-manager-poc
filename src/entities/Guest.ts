import { Person } from '@/types/account';

class Guest extends Person {
  readonly isGuest = true;
}

export default Guest;
