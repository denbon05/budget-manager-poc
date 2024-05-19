<script setup lang="ts">
import ExpensesTable from '@/components/home/ExpensesTable.vue';
import AlterExpenses from '@/components/home/AlterExpenses.vue';
</script>

<template>
  <v-row justify="center">
    <v-col>
      <ExpensesTable />
    </v-col>

    <AlterExpenses />
  </v-row>
</template>
