<script setup lang="ts">
import ExpensesTable from '@/components/home/ExpensesTable.vue';
import { useClientState } from '@/composables/useClientState';
import { ref } from 'vue';

const { isSideBarVisible: shouldAddIncomeBtnBeVisible } = useClientState();

const expensesTableRef = ref<InstanceType<typeof ExpensesTable>>();

const createExpense = () => expensesTableRef.value?.createExpense();

defineEmits<{
  (event: 'createEarning'): Promise<void>;
}>();
</script>

<template>
  <v-row justify="center">
    <v-col>
      <ExpensesTable ref="expensesTableRef" />
    </v-col>

    <v-btn
      v-if="shouldAddIncomeBtnBeVisible"
      @click="$emit('createEarning')"
      variant="tonal"
      append-icon="mdi-plus"
      id="addIncomeBtn"
    >
      {{ $t('earnings.cta') }}
    </v-btn>

    <v-btn
      v-else
      id="addExpenseBtn"
      icon="mdi-plus"
      variant="elevated"
      elevation="3"
      @click="createExpense"
    >
    </v-btn>
  </v-row>
</template>

<style lang="scss" scoped>
#addExpenseBtn {
  position: fixed;
  bottom: 5dvh;
  right: 5dvw;
}

#addIncomeBtn {
  position: fixed;
  bottom: 5dvh;
  right: 5dvw;
  z-index: 100000 !important;
}
</style>
