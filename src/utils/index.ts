import ClientStorage from '@/entities/ClientStorage';
import moment from 'moment';

/** Auto verify the logged in user.
 * @param {Function} fallBackCb Call back in case user is invalid */
export const verifyUser = (fallBackCb: () => void) => {
  const googleStored = ClientStorage.getItem('google');

  if (!googleStored?.expiry_date) {
    console.warn('Broken credential - try to log in again');
    // no way to proceed
    fallBackCb();
    return;
  }

  const expirationTime = parseInt(googleStored.expiry_date);
  const hasTokenExpired = moment().isAfter(expirationTime);

  if (hasTokenExpired) {
    fallBackCb();
    return;
  }

  const timeToCheckUserValidation = moment(expirationTime)
    .subtract(moment().valueOf())
    .valueOf();
  // track is user still active
  setTimeout(() => {
    verifyUser(fallBackCb);
  }, timeToCheckUserValidation);
};
