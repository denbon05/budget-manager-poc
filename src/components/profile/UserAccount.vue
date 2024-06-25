<script setup lang="ts">
import { user } from '@/composables/useUser';
import AuthMethods from './AuthMethods.vue';
import AccountManageable from './AccountManageable.vue';

// TODO if user not authorized show auth methods
// else show user info: email, logout btn
</script>

<template>
  <v-list-group value="account">
    <template #activator="{ props }">
      <v-list-item
        v-bind="props"
        prepend-icon="mdi-account-circle"
        :title="$t('account.name')"
      ></v-list-item>
    </template>

    <component :is="user.isGuest ? AuthMethods : AccountManageable"></component>
  </v-list-group>
</template>
