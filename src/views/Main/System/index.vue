<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useSystemConstantsStore } from '@/stores/systemConstants'
import { ref, reactive, watch, computed, onMounted, nextTick } from 'vue'

import filters from '@/filters'
import TablePerPage from '@/components/Common/TablePerPage.vue'
import TablePagination from '@/components/Common/TablePagination.vue'

const { t } = useI18n()
const toast = useToast()
const systemConstantsStore = useSystemConstantsStore()

const rows = ref([])
const numerationIndex = ref(1)

const modal = ref(false)
const loading = ref(true)
const valueRef: any = ref(null)
const modalLoading = ref(false)

const singleItem = ref({
  id: 0,
  value: '',
  isNeedDivide: false
})

const filterData: any = reactive({
  pagination: {
    page: 1,
    rowsNumber: 1,
    totalCount: 1,
    rowsPerPage: Number(localStorage.getItem('pageSize')) || 10
  }
})

const fields = computed(() => [
  { key: 'index', label: '№', class: 'text-center' },
  { key: 'name', label: t('title') },
  { key: 'value', label: t('value'), class: 'text-center' },
  { key: 'actions', label: t('edit'), class: 'text-center' }
])

watch(() => modal.value, val => {
  if (val) setTimeout(() => valueRef.value.focus(), 100)
})

watch(() => singleItem.value?.value, val => {
  if (singleItem.value.isNeedDivide) {
    const result = val
      .replace(/^0+(?=\d)/, '')
      .replace(/\D/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

    nextTick(() => {
      singleItem.value.value = result
    })
  }
})

async function getList() {
  try {
    loading.value = true
    const data = await systemConstantsStore.getSystemConstants({
      CurrentPage: filterData.pagination.page,
      PerPage: filterData.pagination.rowsPerPage
    })

    for (let i = 0; i < data.length; i++) {
      if (data[i].isNeedDivide) data[i].value = (data[i].value / 100).toString()
    }

    rows.value = data
    filterData.pagination.rowsNumber = systemConstantsStore.totalPages
    filterData.pagination.totalCount = data.length // systemConstantsStore.totalCount

    numerationIndex.value = (filterData?.pagination.page - 1) * filterData?.pagination.rowsPerPage
    signIndex()
  } finally {
    loading.value = false
  }
}

const signIndex = () => {
  if (rows.value?.length) {
    rows.value.forEach((row: any, index) => {
      if (filterData.pagination.page === 1) row.index = index + 1
      else row.index = numerationIndex.value + index + 1
    })
  }
}

const getItem = (item: any) => {
  singleItem.value = JSON.parse(JSON.stringify(item))
  modal.value = true
}

async function submit() {
  if (!singleItem?.value) return

  try {
    modalLoading.value = true

    const data = await systemConstantsStore.editIntegrationSystems({
      id: singleItem.value.id,
      constantValue: singleItem.value.isNeedDivide
        ? (Number(singleItem.value?.value.replace(/[^0-9]/g, '')) * 100).toString()
        : singleItem.value?.value
    })

    if (data?.result) {
      await getList()
      modal.value = false
      toast.success(t('success.updated'))
    }
  } finally {
    modalLoading.value = false
  }
}

onMounted(async () => await getList())
</script>

<template>
  <b-row class="table-list mb-3">
    <b-col>
      <b-card no-body class="card-box-shadow">
        <b-card-header class="align-items-center d-flex justify-content-between">
          <TablePerPage :pagination="filterData.pagination" @emit:update="getList" />
        </b-card-header>

        <div class="table-responsive mb-0">
          <b-table :items="rows" :fields="fields" :busy="loading" :show-empty="!loading" hover>
            <template #table-busy>
              <div class="text-center text-primary my-2">
                <b-spinner class="align-middle mr-2"></b-spinner>
                <strong>{{$t('loading')}}...</strong>
              </div>
            </template>

            <template #empty="scope">
              <h6 class="text-center text-muted py-2 mb-0">{{ $t('error.noData') }}</h6>
            </template>

            <template #cell(value)="{ item }">
              <span v-if="item.isNeedDivide">{{ filters.filterMoney(item.value) }}</span>
              <span v-else>{{ item.value }}</span>
            </template>

            <template v-slot:cell(actions)="{ item }">
              <i class="mdi mdi-pencil-outline text-info cup h3" @click="getItem(item)"></i>
            </template>
          </b-table>
        </div>
      </b-card>

      <TablePagination :pagination="filterData?.pagination" @emit:change="getList" />
    </b-col>

    <b-modal
      v-model="modal"
      id="showModal"
      hide-footer
      :title="$t('edit')"
      header-class="p-3 bg-light"
      class="v-modal-custom"
      centered
    >
      <b-form @submit.prevent="submit" id="addform" class="tablelist-form" autocomplete="off">
        <div class="w-100 px-2 mb-3">
          <div class="row">
            <b-col
              lg="12"
              class="input-with-info d-flex align-items-center justify-content-around px-2 mb-3"
            >
              <label class="form-label mb-0 fs-16" for="value-input">{{ $t('value') }}</label>
              <b-form-input
                v-model="singleItem.value"
                ref="valueRef" id="value-input"
                class="system-dialog-input"
              />
            </b-col>
          </div>
        </div>

        <div class="hstack gap-2 justify-content-center">
          <b-button type="button" id="closemodal" variant="light" @click="modal = false">
            {{ $t('btn_text.close') }}
          </b-button>
          <b-button type="submit" variant="info" :loading="modalLoading" :loading-mode="'fill'">{{
            $t('save')
          }}</b-button>
        </div>
      </b-form>
    </b-modal>
  </b-row>
</template>

<style>
.system-dialog-input {
  width: 100%;
  max-width: 300px !important;
}
</style>
