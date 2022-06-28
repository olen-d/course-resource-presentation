<script setup>
import { onMounted, ref, watch } from 'vue'

import { NFormItem, NInput } from 'naive-ui'

const emits = defineEmits(['changeFormValues', 'changeShouldClearInput'])

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
    default: 'Message'
  },
  placeholder: {
    type: String,
    default: 'Suggest a new feature, let us know something is broken, or say what is on your mind...'
  },
  required: {
    type: Boolean,
    default: true
  },
  shouldClearInput: {
    type: Boolean,
    default: false
  }
})

const changedState = { isChanged: false }
const errorMessage = 'Please enter a valid message'
const message = ref('')
const validationStatus = ref('')
const warningMessage = 'A valid message is needed for us to send a response'

onMounted(() => {
  message.value = props.initialValue
  emitChange()
})

const emitChange = () => {
  emits('changeFormValues', { inputName: 'message', inputValue: message.value, isChanged: changedState.isChanged, validationStatus: validationStatus.value, errorMessage, warningMessage })
}

const handleBlur = () => {
  if (!changedState.isChanged) {
    changedState.isChanged = true
  }
  const isValid = validate(message.value)
  validationStatus.value = props.required ? isValid ? 'success' : 'error' : isValid ? 'sucess' : 'warning'
  emitChange()
}

const validate = message => {
  const isValid = typeof message === 'string' && message.length > 0
  return isValid
}

watch(() => props.isServerError, (isServerError, prevIsServerError) => {
  if (isServerError) {
    validationStatus.value = 'error'
    isValid.value = false
    emitChange()
  }
})

watch(() => props.shouldClearInput, (shouldClearInput, prevShouldClearInput) => {
  if (shouldClearInput) {
    message.value = ''
    emits('changeShouldClearInput', false)
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
      v-model:value="message"
      type="textarea"
      rows="9"
      :placeholder="placeholder"
      :clearable="true"
      style="margin-bottom: 0.5rem"
      @blur="handleBlur"
    />
  </n-form-item>
</template>
