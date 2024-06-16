<script setup lang="ts">
import ExpensesTable from '@/components/home/ExpensesTable.vue';
// TODO add history of changes: old, new, timestamp. Snapshots?
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col>
        <ExpensesTable />
      </v-col> </v-row
  ></v-container>
</template>

<style lang="scss" scoped></style>
