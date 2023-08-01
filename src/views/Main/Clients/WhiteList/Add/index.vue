<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useWhiteListStore } from '@/stores/whiteList'

const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const whiteListStore = useWhiteListStore()

const loading = ref(false)
const pinflLoad = ref(false)

const form = ref({
  pinfl: '',
  firstName: '',
  lastName: '',
  middleName: '',
  passportSeries: '',
  passportNumber: '',
  organizationDebtorId: ''
})

async function checkPinfl() {
  if (form.value.pinfl.length === 14) {
    try {
      pinflLoad.value = true
      const data = await whiteListStore.checkPinfl(form.value.pinfl)

      if (data.result) {
        form.value = data.result
      } else {
        toast.error(t('error.noSuchPinfl'))
      }
    } finally {
      pinflLoad.value = false
    }
  }
}

async function submit() {
  if (form.value.organizationDebtorId == '') return

  try {
    loading.value = true

    const data = await whiteListStore.addPayer({
      organizationDebtorId: form.value.organizationDebtorId
    })

    if (data.result) {
      form.value = {
        pinfl: '',
        firstName: '',
        lastName: '',
        middleName: '',
        passportSeries: '',
        passportNumber: '',
        organizationDebtorId: ''
      }
      toast.success(t('success.added'))
      router.push({ name: 'MainClientsWhiteList' })
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <b-row>
    <b-col lg="12">
      <b-card no-body class="card-box-shadow">
        <b-form @submit.prevent="submit">
          <b-card-header>
            <h5 class="card-title mb-0">{{ $t('viewBox.clientData') }}</h5>
          </b-card-header>
          <b-card-body>
            <b-row class="g-4">
              <b-col lg="4" md="6" sm="6">
                <div>
                  <label for="white-pinfl" class="form-label">
                    {{ $t('userInfo.pinfl') }} <span class="text-danger">*</span>
                  </label>
                  <b-input-group>
                    <template #append>
                      <b-input-group-text @click="checkPinfl" class="cup">
                        <i class="mdi mdi-send-check-outline h5 mb-0 text-info"></i>
                      </b-input-group-text>
                    </template>
                    <b-form-input
                      v-model="form.pinfl" type="text"
                      class="form-control" id="white-pinfl"
                      v-maska data-maska="##############"
                      @keydown.enter="checkPinfl"
                    ></b-form-input>
                  </b-input-group>
                </div>
              </b-col>

              <b-col lg="4" md="6" sm="6">
                <div>
                  <label for="white-lastName" class="form-label"
                    >{{ $t('userInfo.lastName') }} <span class="text-danger">*</span>
                  </label>
                  <input type="text" class="form-control" id="white-lastName" :value="form.lastName" readonly />
                </div>
              </b-col>

              <b-col lg="4" md="6" sm="6">
                <div>
                  <label for="white-name" class="form-label">
                    {{ $t('userInfo.name') }} <span class="text-danger">*</span>
                  </label>
                  <input type="text" class="form-control" id="white-name" :value="form.firstName" readonly />
                </div>
              </b-col>

              <b-col lg="4" md="6" sm="6">
                <div>
                  <label for="white-middleName" class="form-label">{{ $t('userInfo.middleName') }}</label>
                  <input type="text" class="form-control" id="white-middleName" :value="form.middleName" readonly />
                </div>
              </b-col>

              <b-col lg="4" md="6" sm="6">
                <div>
                  <label for="white-passport" class="form-label">
                    {{ $t('userInfo.numberSeries') }} <span class="text-danger">*</span>
                  </label>
                  <input
                    type="text" id="white-passport"
                    class="form-control text-uppercase" readonly
                    :value="form.passportSeries + ' ' + form.passportNumber"
                  />
                </div>
              </b-col>

              <b-col lg="12">
                <div class="hstack justify-content-end gap-2">
                  <b-button type="button" variant="warning" @click="$router.go(-1)">
                    <i class="ri-close-line align-bottom"></i>
                    {{ $t('btn_text.cancel') }}
                  </b-button>

                  <b-button
                    type="submit" variant="info"
                    :loading="loading" loading-mode="fill"
                    :disabled="form.organizationDebtorId == '' || form.pinfl?.length !== 14"
                  >
                    {{ $t('add') }}
                  </b-button>
                </div>
              </b-col>
            </b-row>
          </b-card-body>
        </b-form>
      </b-card>
    </b-col>
  </b-row>
</template>
