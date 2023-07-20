<script setup>
import { onMounted, ref, watch } from 'vue'

import { NFormItem, NSelect } from 'naive-ui'

const emits = defineEmits(['updateSelectValues'])

const props = defineProps({
  initialValue: {
    type: String,
    default: null
  },
  inputName: {
    type: String,
    default: 'selectInteractive'
  },
  labeltext: {
    type: String,
    default: 'Interactive Select'
  },
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Select an option...'
  }
})

const inputValue = ref(null)

onMounted(() => {
  if (props.initialValue) {
    inputValue.value = props.initialValue
    emitChange()
  }
})

const emitChange = () => {
  emits('updateSelectValues', { inputName: props.inputName, inputValue: inputValue.value })
}

const handleUpdateValue = (value, option) => {
  inputValue.value = value
  emitChange()
}

watch(() => props.initialValue, (newInitialValue, prevInitialValue) => {
  inputValue.value = newInitialValue
  emitChange(props.inputName, inputValue.value)
})

</script>

<template>
  <n-form-item
    :label="labeltext"
    :required="false"
  >
    <n-select
      v-model:value="inputValue"
      :placeholder="placeholder"
      :options="options"
      style="margin-bottom: 0.5rem"
      @update:value="handleUpdateValue"
    />
  </n-form-item>
</template>
