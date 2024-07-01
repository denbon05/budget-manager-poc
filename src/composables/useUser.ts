import ClientStorage from '@/entities/ClientStorage';
import Guest from '@/entities/Guest';
import User from '@/entities/User';
import type { Person } from '@/types/account';
import type { GoogleOAuthRedirectQuery } from '@/types/auth';
import { RouteNames } from '@/types/router';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export const user = reactive<Person>(new Guest());

export const useUser = () => {
  const route = useRoute();
  const router = useRouter();

  watch(
    () => route.query.access_token,
    () => {
      console.log('WATCH access_token', route.query);
      if (isEmpty(route.query)) return;

      const { expiry_date, token_type, access_token } =
        route.query as GoogleOAuthRedirectQuery;
      ClientStorage.setItem('google', {
        access_token,
        expiry_date,
        token_type,
      });

      Object.assign(user, new User(user));
      // TODO broadcast within opened tabs
      router.replace({ name: RouteNames.Profile });
    },
  );

  const googleStored = ClientStorage.getItem('google');

  if (googleStored) {
    // attempt to use authenticated user
    Object.assign(user, new User(user));
  } else {
    // guest in any other case
    Object.assign(user, new Guest());
  }

  return user;
};
