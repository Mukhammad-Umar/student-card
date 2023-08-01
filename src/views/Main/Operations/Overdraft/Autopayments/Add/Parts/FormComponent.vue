<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToast } from 'vue-toastification'
import { useVuelidate } from '@vuelidate/core'
import { useBranchStore } from '@/stores/branch'
import { required } from '@/utils/i18n-validators'
import { useAutopaymentStore } from '@/stores/autopayment'
import { ref, onMounted, watch, computed, nextTick } from 'vue'

import Moment from 'moment'
import ClientsInput from './ClientsInput.vue'
import BranchSelect from '@/components/UI/BranchSelect.vue'

const toast = useToast()
const router = useRouter()
const branchStore = useBranchStore()
const userStore: any = useUserStore()
const autopaymentStore = useAutopaymentStore()

const statuses: any = ref([])
const loading = ref(false)
const contractsList: any = ref([])

const form = ref({
  clientId: null,
  amount: null,
  organizationBranchId: null,
  actionState: 0,
  contractId: null,
  terminalGroupName: null,
  startDate: Moment(new Date()).format('YYYY-MM-DD')
})

const rules = computed(() => {
  return {
    amount: { required },
    organizationBranchId: { required },
    actionState: { required },
    contractId: { required },
    startDate: { required }
  }
})

const $v = useVuelidate(rules, form.value)

const dateConfigs = computed(() => {
  return {
    minDate: Moment().format('YYYY-MM-DD'),
    maxDate: Moment().add(1, 'years').format('YYYY-MM-DD'),
    altInput: true,
    altFormat: 'd-m-Y',
    allowInput: true
  }
})

watch(() => form.value.clientId, val => {
  contractsList.value = []
  form.value.contractId = null
  form.value.terminalGroupName = null
  emit('emit:val', val || null)

  if (val) getContracts(val)
})

watch( () => form.value.contractId, val => {
  if (val) {
    form.value.terminalGroupName = contractsList.value.filter((contract: any) => contract.id === val)[0].terminalGroupName
  }
})

watch( () => form.value.amount, (val: any) => {
  if (val) {
    const result = val
      .replace(/^0+(?=\d)/, '')
      .replace(/[^0-9,.]/g, '')
      .replace(/(\.\d{3,})[, ]*/g, '.')
      .replace(/(\,\d{3,})[, ]*/g, ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

    nextTick(() => {
      form.value.amount = result
    })
    }
})

async function getStatus() {
  const data = await autopaymentStore.getActionStates()
  statuses.value = data?.result
}

async function getOwnBranchId() {
  const data = await branchStore.getOwnBranchId()
  if (data?.id) form.value.organizationBranchId = data?.id
}

async function getContracts(clientId: any) {
  const data = await autopaymentStore.getContracts({
    organizationDebtorId: clientId,
    currentPage: 1,
    perPage: 100
  })
  contractsList.value = data?.data.result

  if (contractsList.value?.length === 1) form.value.contractId = contractsList.value[0].id
}

const checkOnDots = (amount: string) => {
  if (amount.split('.').length > 2) {
    toast.error('Сумма введена не верно')
    return false
  } else if (amount.split('.').length === 2) {
    let val = amount.split('.').join('').replace(/[^0-9]/g, '')

    if (amount.split('.')[1].length === 1) return parseInt(val) * 10
    else if (amount.split('.')[1].length === 0) return parseInt(val) * 100
    else return parseInt(val)
  }
}

const checkOnComma = (amount: string) => {
  if (amount.split(',').length > 2) {
    toast.error('Сумма введена не верно')
    return false
  } else if (amount.split(',').length === 2) {
    let val = amount.split(',').join('').replace(/[^0-9]/g, '')

    if (amount.split(',')[1].length === 1) return parseInt(val) * 10
    else if (amount.split(',')[1].length === 0) return parseInt(val) * 100
    else return parseInt(val)
  }
}

async function submit() {
  $v.value.$touch()
  if ($v.value.$invalid) return

  try {
    loading.value = true
    let params = JSON.parse(JSON.stringify(form.value))

    if (params.amount.includes('.')) {
      let checkAmount = checkOnDots(params.amount)
      if (checkAmount) params.amount = checkAmount
      else return false
    } else if (params.amount.includes(',')) {
      let checkAmount = checkOnComma(params.amount)
      if (checkAmount) params.amount = checkAmount
      else return false
    } else params.amount = parseInt(params.amount.replace(/[^0-9]/g, '')) * 100
    
    const data = await autopaymentStore.addAutopayment({
      organizationContractId: params.contractId,
      organizationBranchId: params.organizationBranchId || 0,
      actionState: params.actionState,
      amount: params.amount,
      startDate: params.startDate,
      cards: params?.cards
    })

    emit('emit:success')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getOwnBranchId()
  await getStatus()
})

const emit = defineEmits(['emit:val', 'emit:success'])
</script>

<template>
  <b-card no-body>
    <b-form @submit.prevent="submit">
      <b-card-header>
        <h5 class="card-title mb-0">{{ $t('viewBox.clientData') }}</h5>
      </b-card-header>
      <b-card-body>
        <b-row class="g-4">
          <b-col lg="4" v-if="userStore.userInfo.isMainBranch">
            <div>
              <label for="form-pinfl" class="form-label"
                >{{ $t('filters.branch') }} <span class="text-danger">*</span>
              </label>
              <BranchSelect :params="form" :notClear="true" />
            </div>
          </b-col>

          <b-col lg="4">
            <div>
              <label for="form-lastName" class="form-label"
                >({{ $t('userInfo.pinfl') }}) {{ $t('filters.fio')
                }}<span class="text-danger">*</span>
              </label>
              <ClientsInput :form="form" />
            </div>
          </b-col>

          <b-col lg="4">
            <div>
              <label class="form-label"
                >{{ $t('viewBox.contract') }} <span class="text-danger">*</span>
              </label>
              <select
                class="form-control" data-choices
                v-model="$v.contractId.$model"
                :class="{
                  'is-invalid': $v.contractId.$error && $v.contractId.$dirty,
                  error: $v.contractId.$error
                }"
              >
                <option v-for="contract in contractsList" :key="contract.id" :value="contract.id">{{ contract.name }}</option>
              </select>
            </div>
          </b-col>

          <b-col lg="4">
            <div>
              <label for="form-epos" class="form-label">{{ $t('userInfo.epos') }} </label>
              <input
                type="text" class="form-control"
                id="form-epos" readonly
                v-model="form.terminalGroupName"
              />
            </div>
          </b-col>

          <b-col lg="4">
            <div>
              <label for="form-passport" class="form-label"
                >{{ $t('dialog.action') }} <span class="text-danger">*</span>
              </label>
              <select class="form-select" data-choices v-model="form.actionState">
                <option v-for="status in statuses" :key="status.id" :value="status.id">{{ status.name }}</option>
              </select>
            </div>
          </b-col>
        </b-row>
      </b-card-body>

      <b-card-header>
        <h5 class="card-title mb-0">{{ $t('viewBox.autopayData') }}</h5>
      </b-card-header>
      <b-card-body>
        <b-row class="g-4">
          <b-col lg="4">
            <div>
              <label for="form-contract" class="form-label"
                >{{ $t('amount') }} <span class="text-danger">*</span>
              </label>
              <input
                type="text" class="form-control"
                id="form-contract" v-model="$v.amount.$model"
                :class="{
                  'is-invalid': $v.amount.$error && $v.amount.$dirty,
                  error: $v.amount.$error
                }"
              />
            </div>
          </b-col>

          <b-col lg="4">
            <div>
              <label class="form-label"
                >{{ $t('filters.startWriteOff') }} <span class="text-danger">*</span>
              </label>
              <flat-pickr
                v-model="$v.startDate.$model" :config="dateConfigs"
                :placeholder="$t('selectDate')" class="form-control flatpickr-input"
                :class="{
                  'is-invalid': $v.startDate.$error && $v.startDate.$dirty,
                  error: $v.startDate.$error
                }"
              ></flat-pickr>
            </div>
          </b-col>

          <b-col lg="12">
            <div class="hstack justify-content-end gap-2">
              <b-button type="button" variant="warning" @click="$router.go(-1)">
                <i class="ri-close-line align-bottom"></i>
                {{ $t('btn_text.cancel') }}
              </b-button>
              <b-button type="submit" variant="info" :loading="loading">{{ $t('add') }}</b-button>
            </div>
          </b-col>
        </b-row>
      </b-card-body>
    </b-form>
  </b-card>
</template>

<style></style>
