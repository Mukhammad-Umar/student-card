<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toastification'
import { useClientStore } from '@/stores/client'
import { useBranchStore } from '@/stores/branch'
import { ref, onMounted, computed } from 'vue'

import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@/utils/i18n-validators'
import BranchSelect from '@/components/UI/BranchSelect.vue'

const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const userStore: any = useUserStore()
const clientStore = useClientStore()
const branchStore = useBranchStore()

const loading = ref(false)

const form: any = ref({
  pinfl: '',
  firstName: '',
  lastName: '',
  middleName: '',
  passportInfo: '',
  phoneNumber: '',
  studentId: '',
  organizationBranchId: null as null | number,
})

const rules = computed(() => {
  return {
    pinfl: { required, minLength: minLength(14) },
    firstName: { required },
    lastName: { required },
    passportInfo: { required },
    phoneNumber: { required },
    studentId: { required },
    organizationBranchId: { required },
  }
})

const $v = useVuelidate(rules, form.value)

async function getOwnBranchId() {
  const data = await branchStore.getOwnBranchId()
  if (data?.id) form.value.organizationBranchId = data?.id
}

async function submit() {
  $v.value.$touch()
  if ($v.value.$invalid) return

  try {
    loading.value = true
    let params = JSON.parse(JSON.stringify(form.value))

    params.passportSeries = params.passportInfo.split(' ')[0].toUpperCase()
    params.passportNumber = params.passportInfo.split(' ')[1]
    delete params.passportInfo

    const data = await clientStore.addClientContract(params)

    if (data.result) {
      toast.success(t('success.added'))
      router.push({ name: 'MainStudentsContractsList' })
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getOwnBranchId()
})
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
              <b-col lg="4">
                <div>
                  <label for="addClient-lastName" class="form-label">{{ $t('userInfo.lastName') }} <span class="text-danger">*</span></label>
                  <input
                    v-model="$v.lastName.$model" type="text" id="addClient-lastName" class="form-control"
                    :class="{ 'is-invalid': $v.lastName.$error && $v.lastName.$dirty, error: $v.lastName.$error }"
                  />
                </div>
              </b-col>

              <b-col lg="4">
                <div>
                  <label for="addClient-name" class="form-label">{{ $t('userInfo.name') }} <span class="text-danger">*</span></label>
                  <input
                    v-model="$v.firstName.$model" type="text" class="form-control" id="addClient-name" 
                    :class="{ 'is-invalid': $v.firstName.$error && $v.firstName.$dirty, error: $v.firstName.$error }"
                  />
                </div>
              </b-col>

              <b-col lg="4">
                <div>
                  <label for="addClient-middleName" class="form-label">{{ $t('userInfo.middleName') }}</label>
                  <input type="text" class="form-control" id="addClient-middleName" v-model.trim="form.middleName"/>
                </div>
              </b-col>

              <b-col lg="4">
                <div>
                  <label for="addClient-pinfl" class="form-label">{{ $t('userInfo.pinfl') }} <span class="text-danger">*</span></label>
                  <input
                    v-model="$v.pinfl.$model" type="text" id="addClient-pinfl" 
                    class="form-control" v-maska data-maska="##############"
                    :class="{ 'is-invalid': $v.pinfl.$error && $v.pinfl.$dirty, error: $v.pinfl.$error }"
                  />
                </div>
              </b-col>

              <b-col lg="4">
                <div>
                  <label for="addClient-passport" class="form-label">{{ $t('userInfo.numberSeries') }} <span class="text-danger">*</span></label>
                  <input
                    type="text" class="form-control text-uppercase" id="addClient-passport"
                    v-model.trim="$v.passportInfo.$model" v-maska data-maska="@@ #######"
                    :class="{ 'is-invalid': $v.passportInfo.$error && $v.passportInfo.$dirty, error: $v.passportInfo.$error }"
                  />
                </div>
              </b-col>

              <b-col lg="4">
                <div>
                  <label for="addClient-passport" class="form-label">{{ $t('userInfo.phoneNumber') }} <span class="text-danger">*</span></label>

                  <div class="input-group">
                    <span class="input-group-text">+998</span>
                    <input
                      v-model="$v.phoneNumber.$model" class="form-control"
                      v-maska data-maska="## ###-##-##" type="search" aria-label="Username"
                      :class="{ 'is-invalid': $v.phoneNumber.$error && $v.phoneNumber.$dirty, error: $v.phoneNumber.$error }"
                    />
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-card-body>

          <b-card-header>
            <h5 class="card-title mb-0">{{ $t('viewBox.contractData') }}</h5>
          </b-card-header>
          <b-card-body>
            <b-row class="g-4">
              <b-col lg="4">
                <div>
                  <label for="addClient-contract" class="form-label">ID студента <span class="text-danger">*</span></label>
                  <input
                    v-model="$v.studentId.$model" id="addClient-contract" type="text" class="form-control"
                    :class="{ 'is-invalid': $v.studentId.$error && $v.studentId.$dirty, error: $v.studentId.$error}"
                  />
                </div>
              </b-col>

              <b-col lg="4" v-if="userStore.userInfo.isMainBranch">
                <div>
                  <label class="form-label">{{ $t('userInfo.branch') }} <span class="text-danger">*</span></label>
                  <BranchSelect :params="form" :notClear="true" />
                </div>
              </b-col>

              <b-col lg="12">
                <div class="hstack justify-content-center gap-2">
                  <b-button type="button" variant="warning" class="px-5" @click="$router.go(-1)">{{ $t('btn_text.cancel') }}</b-button>
                  <b-button type="submit" variant="primary" class="px-5" :loading="loading">{{ $t('add') }}</b-button>
                </div>
              </b-col>
            </b-row>
          </b-card-body>
        </b-form>
      </b-card>
    </b-col>
  </b-row>
</template>
@/stores/core