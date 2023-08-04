<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, reactive, computed, onMounted } from 'vue'
import { useAutopayFileStore } from '@/stores/autopayFile'

import { writeFile, utils } from 'xlsx'

import filters from '@/filters'
import ExportBtn from '@/components/Common/ExportBtn.vue'
import TableFilters from '@/components/Common/TableFilters.vue'
import TablePerPage from '@/components/Common/TablePerPage.vue'
import TablePagination from '@/components/Common/TablePagination.vue'

const rows: any = ref([])
const { t } = useI18n()
const loading = ref(true)
const loadBtn = ref(false)
const numerationIndex = ref(1)
const exportRef: any = ref(null)
const autopayFile = useAutopayFileStore()

const filterData = reactive({
  search: '',
  pagination: {
    page: 1,
    rowsPerPage: Number(localStorage.getItem('pageSize')) || 10,
    rowsNumber: 1,
    totalCount: 1,
  },
})

const fields = computed(() => [
  { key: 'index', label: '№', class: 'text-center' },
  { key: 'pinfl', label: t('filters.pinfl') },
  { key: 'cli_code', label: 'Код клиента' },
  { key: 'dob', label: 'Дата рождения' },
  { key: 'status', label: 'Статус студента', class: 'text-center' },
])

async function getList() {
  try {
    loading.value = true

    // const data = await autopayFile.getArchiveFiles({
    //   CurrentPage: filterData.pagination.page,
    //   PerPage: filterData.pagination.rowsPerPage,
    // })

    rows.value = [
      {
        pinfl: '41005857270018',
        cli_code: '03582172661',
        dob: '23.02.1998'
      }
    ]

    // rows.value = data?.list
    // filterData.pagination.rowsNumber = data?.totalPages
    // filterData.pagination.totalCount = data?.totalCount

    numerationIndex.value = (filterData?.pagination.page - 1) * filterData?.pagination.rowsPerPage
    signIndex()
  } finally {
    loading.value = false
  }
}

const signIndex = () => {
  if (rows.value?.length) {
    rows.value.forEach((row: any, index: any) => {
      if (filterData?.pagination.page === 1) row.index = index + 1
      else row.index = numerationIndex.value + index + 1
    })
  }
}

async function downloadExcel() {
  try {
    loadBtn.value = true

    // const data = await clientStore.downloadPayers({
    //   Pinfl: filterData?.pinfl || null,
    //   ContractLoanId: filterData?.contractLoanId,
    //   OrganizationBranchId: filterData?.organizationBranchId,
    //   PassportInfo: filterData?.passportInfo?.replace(/\s/g, "") || null,
    // })

    // exportRef.value.download(data)
  } finally {
    loadBtn.value = false
  }
}

const exportInvoiceButton = () => {
    var invoicesWS = utils.json_to_sheet(rows)

    // A workbook is the name given to an Excel file
    var wb = utils.book_new() // make Workbook of Excel

    // add Worksheet to Workbook
    // Workbook contains one or more worksheets
    utils.book_append_sheet(wb, invoicesWS, 'Invoices list') // invoices list is name of Worksheet


    // export Excel file
    writeFile(wb, 'Invoices.xlsx')
}

onMounted(() => getList())
</script>

<template>
  <b-row class="table-list mb-3">
    <b-col>
      <TableFilters :filterData="filterData" @emit:search="getList" />

      <b-card no-body class="card-box-shadow">
        <b-card-header class="align-items-center d-flex flex-wrap justify-content-between">
          <TablePerPage
            :pagination="filterData.pagination"
            @emit:update="getList"
          />

        <div class="d-flex justify-content-end align-items-center">
          <span class="fs-14 border-end text-right pr-2">
            {{ $t('total') }}: {{ filters.filterMoney(filterData.pagination.totalCount) }}
          </span>
          <ExportBtn
            ref="exportRef" style="margin-left: 12px !important"
            :rows="rows" :loadBtn="loadBtn"
            :text="$t('menus.payersContracts')"
            @emit:import="exportInvoiceButton"
          />
        </div>
        </b-card-header>

        <div class="table-responsive mb-0">
          <b-table
            :items="rows"
            :fields="fields"
            :busy="loading"
            :show-empty="!loading"
            hover
          >
            <template #table-busy>
              <div class="text-center text-primary my-2">
                <b-spinner class="align-middle mr-2"></b-spinner>
                <strong>{{ $t('loading') }}...</strong>
              </div>
            </template>

            <template #empty="scope">
              <h6 class="text-center text-muted py-2 mb-0">{{ $t('error.noData') }}</h6>
            </template>

            <template v-slot:cell(status)="{ item }">
              <b-badge variant="danger" class="fs-11">Не импортируемый</b-badge>
            </template>
          </b-table>
        </div>
      </b-card>

      <TablePagination
        :pagination="filterData?.pagination"
        @emit:change="getList"
      />
    </b-col>
  </b-row>
</template>
