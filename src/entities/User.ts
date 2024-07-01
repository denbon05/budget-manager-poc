import { Person } from '@/types/account';
import { verifyUser } from '@/utils';
import ClientStorage from './ClientStorage';
import Guest from './Guest';

class User extends Person {
  private userRef: Person;
  readonly isGuest = false;

  /** @param {Person} userRef Saved link to itself */
  constructor(userRef: Person) {
    super();
    this.userRef = userRef;
    verifyUser(this.logOut);
  }

  logOut = () => {
    Object.assign(this.userRef, new Guest());
    ClientStorage.removeItem('google'); // prune google data from the storage
  };
}

export default User;
