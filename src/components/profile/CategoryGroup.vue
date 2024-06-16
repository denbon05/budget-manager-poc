<script setup lang="ts">
import type { ICategoryGroup } from '@/types/profile-settings';

defineProps<{ category: ICategoryGroup }>();
</script>

<template>
  <v-list-group :value="category.value">
    <template #activator="{ props }">
      <v-list-item
        v-bind="props"
        :prepend-icon="category.icon"
        :title="category.title"
      ></v-list-item>
    </template>

    <v-list-item
      v-for="item of category.items"
      :key="item.key"
      :value="item.key"
      :prepend-icon="item.icon"
      @click="item.onToggle"
      :disabled="item.key === 'theme'"
    >
      <!-- TODO theme -->
      <div class="d-flex justify-space-between align-center">
        <span>{{ item.title }}</span>
        <slot name="actions">
          <v-tooltip
            location="bottom"
            :text="$t(item.isEnabled ? 'state.enabled' : 'state.disabled')"
          >
            <template v-slot:activator="{ props }">
              <v-switch
                @update:modelValue="item.onToggle"
                :value="item.isEnabled"
                v-bind="props"
                density="compact"
                inset
                hide-details
                hide-spin-buttons
              ></v-switch>
            </template>
          </v-tooltip>
        </slot>
      </div>
    </v-list-item>
  </v-list-group>
</template>
