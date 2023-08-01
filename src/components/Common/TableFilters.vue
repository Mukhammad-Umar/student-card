<script setup lang="ts">
import { ref, computed } from 'vue'
import { Moment } from '@/plugins/moment'
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'

const props = defineProps({
  noBtn: Boolean,
  expand: Boolean,
  bankList: Array,
  branches: Array,
  cardTypes: Array,
  actionList: Array,
  pushStates: Array,
  clientTypes: Array,
  systemStates: Array,
  backgroundStatus: Array,
  transactionStates: Array,
  filterData: Object
})

const filterData = ref(props.filterData)

const autoPayConfigs = computed(() => {
  return {
    minDate: Moment().subtract(1, 'years').format('YYYY-MM-DD'),
    maxDate: Moment().format('YYYY-MM-DD'),
    altInput: true,
    altFormat: 'd-m-Y',
    allowInput: true
  }
})

const startDateConfigs = computed(() => {
  return {
    minDate: Moment().subtract(1, 'years').format('YYYY-MM-DD'),
    maxDate: props.filterData?.endDate || Moment().format('YYYY-MM-DD'),
    altInput: true,
    altFormat: 'd-m-Y'
  }
})

const endDateConfigs = computed(() => {
  return {
    minDate: props.filterData?.startDate || Moment().subtract(1, 'years').format('YYYY-MM-DD'),
    maxDate: Moment().format('YYYY-MM-DD'),
    altInput: true,
    altFormat: 'd-m-Y'
  }
})

const search = () => {
  if (props.filterData?.pagination) props.filterData.pagination.page = 1
  emit('emit:search')
}

const emit = defineEmits(['emit:search'])
</script>

<template>
  <b-col lg="12" class="card-box-shadow br-6">
    <b-card no-body>
      <b-card-header>
        <div class="d-flex align-items-center" data-bs-toggle="collapse" href="#collapseExample">
          <h5 class="card-title mb-0 flex-grow-1">{{ $t('filter') }}</h5>
          <i class="mdi align-bottom mdi-magnify h3 mb-0"></i>
        </div>
        <form @submit.prevent="search" class="collaps show" id="collapseExample">
          <b-row class="row-cols-xxl-5 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-1 mt-2 g-3">
            <b-col v-if="filterData?.refNum !== undefined" class="my-2">
              <input
                v-model="filterData.refNum" type="search"
                class="form-control" :placeholder="$t('filters.refNum')"
              />
            </b-col>

            <b-col v-if="filterData?.ext !== undefined" class="my-2">
              <input
                v-model="filterData.ext"
                type="search" id="filter-ext"
                class="form-control" :placeholder="$t('filters.tranExt')"
              />
            </b-col>

            <b-col v-if="filterData?.pinfl !== undefined" class="my-2">
              <input
                v-model="filterData.pinfl"
                type="search" class="form-control"
                v-maska data-maska="##############"
                :placeholder="$t('filters.pinfl')"
              />
            </b-col>

            <b-col v-if="filterData?.fio !== undefined" class="my-2">
              <input
                v-model="filterData.fio" type="search"
                class="form-control" :placeholder="$t('filters.fio')"
              />
            </b-col>

            <b-col v-if="filterData?.holderName !== undefined" class="my-2">
              <input
                v-model="filterData.holderName" type="search"
                class="form-control" :placeholder="$t('filters.holderFio')"
              />
            </b-col>

            <b-col v-if="filterData?.passportInfo !== undefined" class="my-2">
              <input
                v-model="filterData.passportInfo" type="search"
                class="form-control input-uppercase text-uppercase"
                v-maska data-maska="#######" :placeholder="$t('userInfo.passportNumber')"
              />
            </b-col>

            <b-col v-if="filterData?.phoneNumber !== undefined" class="my-2">
              <div class="input-group">
                <span class="input-group-text">+998</span>
                <input
                  v-model="filterData.phoneNumber"
                  type="search"
                  class="form-control"
                  aria-label="Username"
                  v-maska data-maska="## ###-##-##"
                  :placeholder="$t('userInfo.phoneNumber')"
                />
              </div>
            </b-col>

            <b-col v-if="filterData?.contractLoanId !== undefined" class="my-2">
              <input
                v-model="filterData.contractLoanId" type="search"
                class="form-control" :placeholder="$t('filters.contract')"
              />
            </b-col>

            <b-col v-if="filterData?.terminalId !== undefined" class="my-2">
              <input
                v-model="filterData.terminalId" type="search"
                class="form-control" :placeholder="$t('filters.terminalId')"
              />
            </b-col>

            <b-col v-if="filterData?.merchantId !== undefined" class="my-2">
              <input
                v-model="filterData.merchantId" type="search"
                class="form-control" :placeholder="$t('filters.merchantId')"
              />
            </b-col>

            <b-col v-if="filterData?.autopaymentId !== undefined" class="my-2">
              <input
                v-model="filterData.autopaymentId" type="search"
                class="form-control" :placeholder="$t('filters.autoPayId')"
              />
            </b-col>

            <b-col v-if="filterData?.maskCardNumber !== undefined" class="my-2">
              <input
                v-model="filterData.maskCardNumber"
                type="search" class="form-control"
                v-maska data-maska="#### ##!*!* !*!*!*!* ####"
                :placeholder="$t('filters.cardNumber')"
              />
            </b-col>

            <b-col v-if="filterData?.pan !== undefined" class="my-2">
              <input
                v-model="filterData.pan"
                type="search" class="form-control" id="filter-cardNum"
                v-maska data-maska="#### ##!*!* !*!*!*!* ####"
                :placeholder="$t('filters.cardNumber')"
              />
            </b-col>

            <b-col v-if="filterData?.wclientType !== undefined" class="my-2">
              <b-form-select
                v-model="filterData.wclientType" id="filter-wclientType"
                :options="clientTypes" value-field="id" text-field="name"
              ></b-form-select>
            </b-col>

            <b-col v-if="filterData?.organizationBranchId !== undefined" class="my-2">
              <b-form-select
                v-model="filterData.organizationBranchId"
                :options="branches" value-field="id" text-field="name"
              ></b-form-select>
            </b-col>

            <b-col v-if="filterData?.integrationSystemId !== undefined" class="my-2">
              <b-form-select
                v-model="filterData.integrationSystemId"
                :options="systemStates" value-field="id" text-field="name"
              ></b-form-select>
            </b-col>

            <b-col v-if="filterData?.pushState !== undefined" class="my-2">
              <b-form-select
                v-model="filterData.pushState"
                :options="pushStates" value-field="id" text-field="name"
              ></b-form-select>
            </b-col>

            <b-col v-if="filterData?.transactionReverseState !== undefined" class="my-2">
              <b-form-select
                v-model="filterData.transactionReverseState"
                :options="transactionStates" value-field="id" text-field="name"
              ></b-form-select>
            </b-col>

            <b-col v-if="filterData?.transactionState !== undefined" class="my-2">
              <b-form-select
                v-model="filterData.transactionState"
                :options="transactionStates" value-field="id" text-field="name"
              ></b-form-select>
            </b-col>

            <b-col v-if="filterData?.cardGateType !== undefined" class="my-2">
              <b-form-select
                v-model="filterData.cardGateType"
                :options="cardTypes" value-field="id" text-field="name"
              ></b-form-select>
            </b-col>

            <b-col v-if="filterData?.recordState !== undefined" class="my-2">
              <b-form-select
                v-model="filterData.recordState"
                :options="actionList" value-field="id" text-field="name"
              ></b-form-select>
            </b-col>

            <b-col v-if="filterData?.autoPaymentDate !== undefined" class="my-2">
              <flat-pickr
                v-model="filterData.autoPaymentDate"
                :config="autoPayConfigs"
                :placeholder="$t('selectDate')"
                class="form-control flatpickr-input"
              ></flat-pickr>
            </b-col>

            <b-col v-if="filterData?.startDate !== undefined" class="my-2">
              <div class="input-group">
                <span class="input-group-text">{{ $t('btn_text.from') }}</span>
                <flat-pickr
                  v-model="filterData.startDate"
                  :config="startDateConfigs"
                  :placeholder="$t('selectDate')"
                  class="form-control flatpickr-input"
                ></flat-pickr>
              </div>
            </b-col>

            <b-col v-if="filterData?.endDate !== undefined" class="my-2">
              <div class="input-group">
                <span class="input-group-text">{{ $t('btn_text.to') }}</span>
                <flat-pickr
                  v-model="filterData.endDate"
                  :config="endDateConfigs"
                  :placeholder="$t('selectDate')"
                  class="form-control flatpickr-input"
                ></flat-pickr>
              </div>
            </b-col>

            <b-col v-if="filterData?.search !== undefined" class="my-2">
              <input
                v-model="filterData.search"
                type="search" class="form-control" :placeholder="$t('search')"
              />
            </b-col>

            <b-col v-if="filterData?.bankId !== undefined" class="my-2"> 
              <Multiselect
                :options="bankList"
                v-model="filterData.bankId"
                label="name" value-prop="id"
                :placeholder="$t('menus.bank')"
                :noOptionsText="$t('error.noData')"
                :noResultsText="$t('error.noData')"
                :searchable="true" :create-option="true"
              />
            </b-col>

            <b-col v-if="!noBtn" class="my-2">
              <b-button variant="info" type="submit" class="w-100">
                {{ $t('search') }}
              </b-button>
            </b-col>
          </b-row>
        </form>
      </b-card-header>
    </b-card>
  </b-col>
</template>
