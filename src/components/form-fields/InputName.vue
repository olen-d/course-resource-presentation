<script setup>
import { onMounted, ref, watch } from 'vue'

import { NFormItem, NInput } from 'naive-ui'

const emits = defineEmits(['changeFormValues'])

const props = defineProps({
  initialValue: {
    type: String,
    default: ''
  },
  isServerError: {
    type: Boolean,
    default: false
  },
  labeltext: {
    type: String,
    default: 'Name'
  },
  placeholder: {
    type: String,
    default: 'Enter your name...'
  },
  required: {
    type: Boolean,
    default: true
  }
})

const changedState = { isChanged: false }
const errorMessage = 'Please enter a valid name'
const name = ref('')
const validationStatus = ref()
const warningMessage = 'Your name helps us remember who you are'

onMounted(() => {
  name.value = props.initialValue
  emitChange()
})

const emitChange = () => {
  emits('changeFormValues', { inputName: 'name', inputValue: name.value, isChanged: changedState.isChanged, validationStatus: validationStatus.value, errorMessage, warningMessage })
}

const handleBlur = () => {
  if (!changedState.isChanged) {
    changedState.isChanged = true
  }
  const isValid = validate(name.value)
  validationStatus.value = props.required ? isValid ? 'success' : 'error' : isValid ? 'sucess' : 'warning'
  emitChange()
}
// TODO: Check for an @ sign and MX record
const validate = name => {
  const isValid = typeof name === 'string' && name.length > 0
  return isValid
}

watch(() => props.isServerError, (isServerError, prevIsServerError) => {
  if (isServerError) {
    validationStatus.value = 'error'
    isValid.value = false
    emitChange()
  }
})
</script>

<template>
  <n-form-item
    :label="labeltext"
    :validation-status="validationStatus"
    :required="required"
  >
    <n-input
      v-model:value="name"
      :placeholder="placeholder"
      :clearable="true"
      style="margin-bottom: 0.5rem"
      @blur="handleBlur"
    />
  </n-form-item>
</template>
