<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toastification'
import { useClientStore } from '@/stores/client'
import { useBranchStore } from '@/stores/branch'
import { useTerminalStore } from '@/stores/terminal'
import { ref, onMounted, watch, computed } from 'vue'

import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@/utils/i18n-validators'
import BranchSelect from '@/components/UI/BranchSelect.vue'

const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const userStore: any = useUserStore()
const clientStore = useClientStore()
const branchStore = useBranchStore()
const terminalStore = useTerminalStore()

const loading = ref(false)
const groups: any = ref([])
const modalShow = ref(false)
const pinflLoad = ref(false)
const selectedGroup: any = ref(null)

const form: any = ref({
  pinfl: '',
  firstName: '',
  lastName: '',
  middleName: '',
  passportInfo: '',
  loanId: '',
  organizationBranchId: null as null | number,
  terminalGroupId: null as null | number
})

const rules = computed(() => {
  return {
    pinfl: { required, minLength: minLength(14) },
    firstName: { required },
    lastName: { required },
    passportInfo: { required },
    loanId: { required },
    organizationBranchId: { required },
    terminalGroupId: { required }
  }
})

const $v = useVuelidate(rules, form.value)

watch(() => form.value.terminalGroupId, val => {
  if (val) selectedGroup.value = groups.value.filter((group: any) => group.id === val)[0].name
})

watch(() => form.value.organizationBranchId, val => {
  selectedGroup.value = null
  form.value.terminalGroupId = null
  getTerminalGroups(val || 0)
})

async function getOwnBranchId() {
  const data = await branchStore.getOwnBranchId()
  if (data?.id) form.value.organizationBranchId = data?.id
}

async function getTerminalGroups(id: number) {
  const data = await clientStore.getTerminalGroups(id)
  groups.value = data?.result
}

async function checkPinfl() {
  if (form.value?.pinfl?.length === 14) {
    try {
      pinflLoad.value = true
      const data = await clientStore.checkPinfl(form.value.pinfl)

      if (data?.result) {
        form.value.firstName = data.result.firstName
        form.value.lastName = data.result.lastName
        form.value.middleName = data.result.middleName
        form.value.passportInfo = data.result.passportSeries + ' ' + data.result.passportNumber
        pinflLoad.value = false
      } else {
        pinflLoad.value = false
        toast.error(t('error.noSuchPinfl'))
      }
    } catch (e) {
      pinflLoad.value = false
    }
  }
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
      router.push({ name: 'MainClientsContractsList' })
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getOwnBranchId()
  if (route.query.pinfl) {
    form.value.pinfl = route.query.pinfl.toString()
    await checkPinfl()
  }
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
                  <label for="addClient-pinfl" class="form-label">{{ $t('userInfo.pinfl') }} <span class="text-danger">*</span></label>
                  <b-input-group>
                    <template #append>
                      <b-input-group-text @click="checkPinfl" class="cup">
                        <i class="mdi mdi-send-check-outline h5 mb-0 text-info"></i>
                      </b-input-group-text>
                    </template>
                    <b-form-input
                      v-model="$v.pinfl.$model" class="form-control" id="addClient-pinfl" 
                      v-maska data-maska="##############" @keydown.enter="checkPinfl" type="text"
                      :class="{ 'is-invalid': $v.pinfl.$error && $v.pinfl.$dirty, error: $v.pinfl.$error }"
                    ></b-form-input>
                  </b-input-group>
                </div>
              </b-col>

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
                  <label for="addClient-passport" class="form-label">{{ $t('userInfo.numberSeries') }} <span class="text-danger">*</span></label>
                  <input
                    type="text" class="form-control text-uppercase" id="addClient-passport"
                    v-model.trim="$v.passportInfo.$model" v-maska data-maska="@@ #######"
                    :class="{ 'is-invalid': $v.passportInfo.$error && $v.passportInfo.$dirty, error: $v.passportInfo.$error }"
                  />
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
                  <label for="addClient-contract" class="form-label">{{ $t('userInfo.contractId') }} <span class="text-danger">*</span></label>
                  <input
                    v-model="$v.loanId.$model" id="addClient-contract" type="text" class="form-control"
                    :class="{ 'is-invalid': $v.loanId.$error && $v.loanId.$dirty, error: $v.loanId.$error}"
                  />
                </div>
              </b-col>

              <b-col lg="4" v-if="userStore.userInfo.isMainBranch">
                <div>
                  <label class="form-label">{{ $t('userInfo.branch') }} <span class="text-danger">*</span></label>
                  <BranchSelect :params="form" :notClear="true" />
                </div>
              </b-col>

              <b-col lg="4">
                <div>
                  <label for="addClient-epos" class="form-label">
                    {{ $t('userInfo.epos') }} <span class="text-danger">*</span>
                  </label>
                  <b-form-input
                    :model-value="selectedGroup" readonly id="addClient-epos" @click="modalShow = true"
                    :class="{ 'is-invalid': $v.terminalGroupId.$error && $v.terminalGroupId.$dirty, error: $v.terminalGroupId.$error}"
                  ></b-form-input>
                </div>
              </b-col>

              <b-col lg="12">
                <div class="hstack justify-content-center gap-2">
                  <b-button type="button" variant="warning" class="px-5" @click="$router.go(-1)">{{ $t('btn_text.cancel') }}</b-button>
                  <b-button type="submit" variant="info" class="px-5" :loading="loading">{{ $t('add') }}</b-button>
                </div>
              </b-col>
            </b-row>
          </b-card-body>
        </b-form>
      </b-card>
    </b-col>

    <b-modal
      v-model="modalShow"
      class="v-modal-custom epos-select-modal" centered
      hide-footer :title="$t('chooseEpos')"
    >
      <div v-if="groups.length" class="w-100 px-1">
        <b-row
          v-for="group in groups" :key="group.id"
          @click="form.terminalGroupId = group.id" :class="{'active': form.terminalGroupId === group.id}"
          class="list-group list-group-dialog justify-content-around pb-1 pt-3 position-relative flex-row cup"
        >
          <p class="absolute-group-name position-absolute w-auto">{{ group.name }}</p>

          <b-col
            v-for="terminal in group.terminals" :key="terminal.id"
            lg="6" md="6" sm="12" class="draggable-items row mb-2 position-relative"
          >
            <div class="draggable-items__box d-flex flex-column justify-content-center w-100 px-2 py-1">
              <div class="d-flex justify-content-between align-items-center">
                <span>{{ $t('epos') }}: </span>
                <span class="text-right">{{ terminal.name?.replace(';', ' ') }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <span>{{ $t('filters.terminalId') }}: </span>
                <span>{{ terminal.terminalId }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <span>{{ $t('filters.merchantId') }}: </span>
                <span>{{ terminal.merchantId }}</span>
              </div>
            </div>
          </b-col>
        </b-row>
      </div>

      <div v-else class="d-flex justify-content-center w-100 mb-2">
        <span class="text-muted">Нет терминала</span>
      </div>
      <div class="modal-footer v-modal-footer justify-content-center">
        <b-button type="button" class="px-5" variant="warning" @click="modalShow = false"
          >{{ $t('btn_text.close') }}
        </b-button>
      </div>
    </b-modal>
  </b-row>
</template>
