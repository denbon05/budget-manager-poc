<script setup lang="ts">
import { fetchExpenses } from '@/api/expenses';
import type { IExpense } from '@/types';
import { ref } from 'vue';
import { useDisplay } from 'vuetify';
import type { VDataTableVirtual } from 'vuetify/components';

// const { expenses } = useExpenses();

const headers: VDataTableVirtual['headers'] = [
  {
    title: 'Outcome',
    align: 'start',
    sortable: false,
    key: 'name',
  },
  { title: 'Budget', key: 'budget', align: 'end' },
  { title: 'Wasted', key: 'wasted', align: 'end' },
  { title: 'Balance', key: 'balance', align: 'end' },
];

const { xs } = useDisplay();
const expenses = ref<IExpense[]>([]);

fetchExpenses()
  .then((fetchedExpenses) => {
    expenses.value = fetchedExpenses;
  })
  .catch(console.error);
</script>

<template>
  <v-col>
    <v-data-table-virtual
      hide-default-footer
      density="compact"
      :mobile="xs"
      :headers="headers"
      :items="expenses"
      :sort-by="[{ key: 'outcome', order: 'asc' }]"
    >
      <template #item.name="{ item: { name } }">
        <b>{{ name }}</b>
      </template>

      <template #item.budget="{ item: { budget } }">
        <v-text-field
          type="number"
          density="compact"
          variant="plain"
          hide-details
          reverse
          :model-value="budget"
        >
        </v-text-field>
      </template>

      <template #item.wasted="{ item: { wasted } }">
        <v-text-field
          type="number"
          density="compact"
          variant="plain"
          hide-details
          reverse
          :model-value="wasted"
        >
        </v-text-field>
      </template>

      <template #item.balance="{ item: { balance } }">
        <v-text-field
          type="number"
          density="compact"
          variant="plain"
          hide-details
          reverse
          :model-value="balance"
        >
        </v-text-field>
      </template>
    </v-data-table-virtual>
  </v-col>
</template>
