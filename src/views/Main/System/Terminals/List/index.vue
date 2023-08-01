<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useTerminalStore } from '@/stores/terminal'
import { ref, reactive, computed, onMounted } from 'vue'

import TableFilters from '@/components/Common/TableFilters.vue'
import TablePerPage from '@/components/Common/TablePerPage.vue'
import TablePagination from '@/components/Common/TablePagination.vue'

const { t } = useI18n()
const terminalStore = useTerminalStore()

const rows = ref([])
const loading = ref(true)
const numerationIndex = ref(1)

const filterData: any = reactive({
  merchantId: null,
  terminalId: null,
  pagination: {
    page: 1,
    rowsNumber: 1,
    totalCount: 1,
    rowsPerPage: Number(localStorage.getItem('pageSize')) || 10
  }
})

const fields = computed(() => [
  { key: 'index', label: '№', class: 'text-center' },
  { key: 'bankName', label: t('filters.bank'), class: 'text-center' },
  { key: 'name', label: t('sysUsers.group'), class: 'text-center' },
  { key: 'uzcardEpos', label: 'Uzcard', class: 'text-center' },
  { key: 'humoEpos', label: 'Humo', class: 'text-center' },
  { key: 'date', label: t('filters.date'), class: 'text-center' },
  { key: 'actions', label: t('edit'), class: 'text-center' }
])

async function getList() {
  try {
    loading.value = true
    const data = await terminalStore.getTerminals({
      OrganizationId: filterData.organizationId,
      MerchantId: filterData.merchantId,
      TerminalId: filterData.terminalId,
      CurrentPage: filterData.pagination.page,
      PerPage: filterData.pagination.rowsPerPage
    })

    rows.value = data
    filterData.pagination.rowsNumber = terminalStore.totalPages
    filterData.pagination.totalCount = terminalStore.totalCount

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

onMounted(() => getList())
</script>

<template>
  <b-row class="table-list mb-3">
    <b-col>
      <TableFilters :filterData="filterData" @emit:search="getList" />

      <b-card no-body class="card-box-shadow">
        <b-card-header class="align-items-center d-flex justify-content-between">
          <TablePerPage :pagination="filterData.pagination" @emit:update="getList" />

          <b-button variant="info" :to="{ name: 'MainOrgsTerminalsAdd' }">
            {{ $t('add') }} <i class="mdi mdi-plus"></i>
          </b-button>
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

            <template v-slot:cell(actions)="{ item }">
              <i
                class="mdi mdi-pencil-outline text-info cup h3"
                @click="$router.push({ name: 'MainOrgsTerminalsEdit', params: { id: item.id } })"
              ></i>
            </template>
          </b-table>
        </div>
      </b-card>

      <TablePagination :pagination="filterData?.pagination" @emit:change="getList" />
    </b-col>
  </b-row>
</template>
