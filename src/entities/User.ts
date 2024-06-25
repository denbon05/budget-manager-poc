import { Person } from '@/types/account';
import Guest from './Guest';
import ClientStorage from './ClientStorage';

class User extends Person {
  private userRef: Person;
  readonly isGuest = false;

  /** @param {Person} userRef Saved link to itself */
  constructor(userRef: Person) {
    super();
    this.userRef = userRef;
  }

  logOut = () => {
    Object.assign(this.userRef, new Guest());
    ClientStorage.removeItem('google'); // prune google data from the storage
  };
}

export default User;
