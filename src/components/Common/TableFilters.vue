<script setup lang="ts">
import { ref, computed } from 'vue'
import { Moment } from '@/plugins/moment'
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'

const props = defineProps({
  users: Array,
  noBtn: Boolean,
  expand: Boolean,
  statuses: Array,
  universities: Array,
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
                v-maska data-maska="@@ #######" :placeholder="$t('userInfo.numberSeries')"
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

            <b-col v-if="filterData?.hemisId !== undefined" class="my-2">
              <input
                v-model="filterData.hemisId" type="search"
                class="form-control" placeholder="ID студента"
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

            <b-col v-if="filterData?.userId !== undefined" class="my-2">
              <b-form-select
                v-model="filterData.userId" id="filter-userId"
                :options="users" value-field="id" text-field="username"
              ></b-form-select>
            </b-col>

            <b-col v-if="filterData?.university !== undefined" class="my-2">
              <b-form-select
                v-model="filterData.university" id="filter-university"
                :options="universities" value-field="hemis_code" text-field="name"
              ></b-form-select>
            </b-col>

            <b-col v-if="filterData?.status !== undefined" class="my-2">
              <b-form-select
                v-model="filterData.status" id="filter-status"
                :class="{'text-inactive': filterData.status === null}"
                :options="statuses" value-field="id" text-field="name"
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

            <b-col v-if="!noBtn" class="my-2">
              <b-button variant="primary" type="submit" class="w-100">
                {{ $t('search') }}
              </b-button>
            </b-col>
          </b-row>
        </form>
      </b-card-header>
    </b-card>
  </b-col>
</template>
