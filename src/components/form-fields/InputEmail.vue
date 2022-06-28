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
    default: 'Email Address'
  },
  placeholder: {
    type: String,
    default: 'Enter your email address...'
  },
  required: {
    type: Boolean,
    default: true
  }
})

const changedState = { isChanged: false }
const errorMessage = 'Please enter a valid email address'
const email = ref('')
const validationStatus = ref()
const warningMessage = 'A valid email address is needed for us to send a response'

onMounted(() => {
  email.value = props.initialValue
  emitChange()
})

const emitChange = () => {
  emits('changeFormValues', { inputName: 'email', inputValue: email.value, isChanged: changedState.isChanged, validationStatus: validationStatus.value, errorMessage, warningMessage })
}

const handleBlur = async () => {
  if (!changedState.isChanged) {
    changedState.isChanged = true
  }
  const isValid = await validate(email.value)
  validationStatus.value = props.required ? isValid ? 'success' : 'error' : isValid ? 'sucess' : 'warning'
  emitChange()
}
// TODO: Check for an @ sign and MX record
const validate = async email => {
  const expression = /.+@.+\..+/i

  if (expression.test(String(email).toLowerCase())) {
    try {
      const result = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/v1/mail/check-mx/${email}`
      )
      const data = await result.json()
      const { mxExists } = data

      return mxExists ? true : false;
    } catch {
      return false;
    }
    return true;
  } else {
    return false;
  }
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
      v-model:value="email"
      :placeholder="placeholder"
      :clearable="true"
      style="margin-bottom: 0.5rem"
      @blur="handleBlur"
    />
  </n-form-item>
</template>
