<script setup lang="ts">
import { ref } from 'vue';

const isDialogOpened = defineModel<boolean>('isDialogOpened', {
  default: false,
});

const defaultAdditionalValue = 0;
const additionalValue = ref(defaultAdditionalValue);

const emit = defineEmits<{
  updateValue: [value: number];
}>();

const onChangeDialogOpened = (isOpened: boolean) => {
  isDialogOpened.value = isOpened;
};

const save = () => {
  if (!additionalValue.value) {
    onChangeDialogOpened(false); // close dialog
    return; // no need to handle
  }

  emit('updateValue', Number(additionalValue.value)); // handle additional value
  onChangeDialogOpened(false); // close dialog
  additionalValue.value = defaultAdditionalValue; // reset dialog value to default
};
</script>

<template>
  <v-dialog
    max-width="500"
    :model-value="isDialogOpened"
    @update:model-value="onChangeDialogOpened"
    @after-leave="save"
  >
    <template v-slot:default>
      <v-card>
        <v-card-title class="d-flex px-5 justify-space-between align-baseline">
          <span class="text-h5">
            <slot name="title"></slot>
          </span>
          <v-btn
            variant="plain"
            icon="mdi-close"
            @click="onChangeDialogOpened(false)"
          ></v-btn>
        </v-card-title>

        <v-card-text class="d-flex align-center">
          <v-icon class="mr-2">mdi-plus</v-icon>
          <v-text-field
            type="number"
            :min="0"
            density="compact"
            variant="solo-filled"
            hide-details
            autofocus
            reverse
            v-model:model-value="additionalValue"
            @focus="$event.target.select()"
            @keyup.enter="save"
          >
          </v-text-field>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>
