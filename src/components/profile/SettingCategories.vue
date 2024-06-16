<script setup lang="ts">
import { useClientState } from '@/composables/useClientState';
import type { ICategoryGroup } from '@/types/profile-settings';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';
import CategoryGroup from './CategoryGroup.vue';
import UserAccount from './UserAccount.vue';

const { t } = useI18n();
const { xs } = useDisplay();
const { isDarkThemeEnabled, toggleAppTheme } = useClientState();

const categories: ICategoryGroup[] = [
  {
    value: 'preferences',
    title: t('preferences.name'),
    icon: 'mdi-tune',
    items: [
      {
        key: 'theme',
        title: t('preferences.theme.dark'),
        icon: 'mdi-brightness-4',
        isEnabled: isDarkThemeEnabled,
        onToggle: toggleAppTheme,
      },
    ],
  },
];
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col sm="11" md="10">
        <v-list
          lines="one"
          variant="text"
          :density="xs ? 'compact' : 'comfortable'"
        >
          <UserAccount />
          <CategoryGroup
            :key="category.value"
            v-for="category of categories"
            :category="category"
          ></CategoryGroup>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>
