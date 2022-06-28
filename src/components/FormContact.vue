<script setup>
import InputEmail from '@/components/form-fields/InputEmail.vue'
import InputMessage from '@/components/form-fields/InputMessage.vue'
import InputName from '@/components/form-fields/InputName.vue'

import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { NAlert, NButton, NModal, NForm, NResult } from 'naive-ui'

const props = defineProps({
  submitActionLabel: {
    type: String,
    default: 'Submit'
  }
})

const errorDescription = ref('')
const errorTitle = ref('')
const fromTitle = ref('')
const formValues = ref([])
const submitState = { isSubmitted: false }
const shouldClearInput = ref(false)
const showErrorMessageBox = ref(false)
const showResult = ref(false)
const showResultStatus = ref('')
const showWarningMessageBox = ref(false)
const warningDescription = ref('')
const warningTitle = ref("")

const router = useRouter()

onMounted(() => {
 const formTitlePersitant = localStorage.getItem('NCGR_ROUTE_PREV_TITLE')
 fromTitle.value = formTitlePersitant === 'undefined' ? 'Home' : formTitlePersitant
})

const getFormErrors = () => {
  const formErrors = formValues.value.filter(element => {
    return element.validationStatus === 'error'
  })
  return formErrors
}

const getFormErrorsChanged = () => {
  const formErrorsChanged = formValues.value.filter(element => {
    return element.isChanged !== false && element.validationStatus === 'error'
  })
  return formErrorsChanged
}

const getFormWarnings = () => {
  const formWarnings = formValues.value.filter(element => {
    return element.validationStatus === 'warning'
  })
  return formWarnings
}

const getFormWarningsChanged = () => {
  const formWarningsChanged = formValues.value.filter(element => {
    return element.isChanged !== false && element.validationStatus === 'warning'
  })
  return formWarningsChanged
}

const handleSubmit = async () => {
  submitState.isSubmitted = true
  const formErrors = getFormErrors()
  if (formErrors?.length > 0) {
    updateFormErrors(formErrors)
  } else {
    // Submit
    const data = {}
    formValues.value.forEach(element => {
      const { inputName, inputValue } = element
      data[inputName] = inputValue
    })

    const fromAddress = data['email']
    const subject = 'No Car Gravel Contact Form'
    const messageStripped = data['message'].replace(/(<([^>]+)>)/gi, ''); // ! TODO: Update this with a more robust function and convert <p> & <br> to \n
    const text = `${messageStripped} \n\n Contact Name: ${data['name']}\nContact Email: ${fromAddress}`;
    const toAddress = 'contact@nocargravel.cc'

    const mailOptions = {
      from: fromAddress,
      to: toAddress,
      subject,
      text
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/mail/send/contact-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mailOptions })
      })
      const result = await response.json()
      const { status } = response

      if (status === 200 && result?.accepted.length > 0) {
        showResult.value = true
        showResultStatus.value = 'success'
      } else {
        console.log("REJECTED!")
      }
      // TODO: Finish the error handling to address all cases
      if (status === 400 && result.message) {
        errorDescription.value = 'One or more required fields were not submitted ot the server. Please try again in a few minutes.'
        errorTitle.value = 'Server Error'
        showErrorMessageBox.value = true
      }
    } catch (error) {
      console.log(error)
    }
  }
}

const handleReturn = () => {
  showResult.value = false
  const path = localStorage.getItem('NCGR_ROUTE_PREV_PATH')
  localStorage.removeItem('NCGR_ROUTE_PREV_TITLE')
  router.push(path)
}

const handleSendAnother = () => {
  showResult.value = false
  shouldClearInput.value = true
}

const updateFormErrors = formErrors => {
  if (formErrors.length > 0) {
    const errorMessages = formErrors.map(element => {
      return element.errorMessage
    })
    errorDescription.value = errorMessages.join('. ') + '.'

    const numberAgreement = formErrors.length === 1 ? 'An Error' : 'Errors'
    errorTitle.value = `The Contact Form Has ${numberAgreement}`

    showErrorMessageBox.value = true
  } else {
    showErrorMessageBox.value = false
    errorDescription.value = ''
    errorTitle.value = ''
  }
}

const updateFormWarnings = formWarnings => {
  if (formWarnings.length > 0) {
    const warningMessages = formWarnings.map(element => {
      return element.warningMessage
    })
    warningDescription.value = warningMessages.join('. ') + '.'

    const numberAgreement = formWarnings.length === 1 ? 'Warning' : 'Warnings'
    warningTitle.value = `Contact Form ${numberAgreement}`

    showWarningMessageBox.value = true
  } else {
    showWarningMessageBox.value = false
    warningDescription.value = ''
    warningTitle.value = ''
  }
}

const updateFormValues = event => {
  const { inputName: name } = event
  const valuesIndex = formValues.value.findIndex(element => element.inputName === name)
  if (valuesIndex === -1) {
    formValues.value.push(event)
  } else {
    formValues.value[valuesIndex] = event
  }
  const formErrors = submitState.isSubmitted ? getFormErrors() : getFormErrorsChanged()
  const formWarnings = submitState.isSubmitted ? getFormWarnings() : getFormWarningsChanged()
  updateFormErrors(formErrors)
  updateFormWarnings(formWarnings)
}

const updateShouldClearInput = event => {
  shouldClearInput.value = event
}

</script>

<template>
  <div class="form-contact">
    <n-modal
      v-model:show="showResult"
    >
      <n-result
        class="modal-result"
        status="success"
        title="Message Sent"
        description="Thank you for contacting us. Your message was delivered. If you provided an email address, you can expect a response within 48 hours."
      >
        <template #footer>
          <n-button type="primary" @click="handleReturn">Return to {{ fromTitle }}</n-button>
          <n-button type="text" @click="handleSendAnother">Send Another Message</n-button>
        </template>
      </n-result>
    </n-modal>
    <n-alert
      v-if="showWarningMessageBox"
      :title="warningTitle"
      type="warning"
      :show-icon="true"
      style="margin-bottom: 1.5rem; text-align: left"
    >
      {{ warningDescription }}
    </n-alert>
    <n-alert
      v-if="showErrorMessageBox"
      :title="errorTitle"
      type="error"
      :show-icon="true"
      style="margin-bottom: 1.5rem; text-align: left"
    >
      {{ errorDescription }}
    </n-alert>
    <n-form label-position="top">
      <InputName :required="false" @change-form-values="updateFormValues($event)" />
      <InputEmail :required="false" @change-form-values="updateFormValues($event)" />
      <InputMessage 
        :required="true"
        :shouldClearInput="shouldClearInput"
        @change-form-values="updateFormValues($event)"
        @change-should-clear-input="updateShouldClearInput($event)"
      />
      <n-button
        type="primary"
        attr-type="submit"
        @click="handleSubmit"
      >
        {{ props.submitActionLabel }}
      </n-button>
    </n-form>
  </div>
</template>

<style scoped>
  .modal-result {
    padding: 3rem;
    background-color: #ffffff;
  }
</style>
