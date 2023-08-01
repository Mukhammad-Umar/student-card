<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useFilesStore } from '@/stores/files'
import { ref, reactive, computed, onMounted } from 'vue'
import { useAutopayFileStore } from '@/stores/autopayFile'

import filters from '@/filters'
import ExportBtn from '@/components/Common/ExportBtn.vue'
import TableFilters from '@/components/Common/TableFilters.vue'
import TablePerPage from '@/components/Common/TablePerPage.vue'
import TablePagination from '@/components/Common/TablePagination.vue'

const { t } = useI18n()
const route = useRoute()
const filesStore = useFilesStore()
const autopayFile = useAutopayFileStore()

const actionList = ref([])
const fileList: any = ref({})
const numerationIndex = ref(1)

const loading = ref(true)
const allLoad = ref(false)
const fileLoad = ref(false)
const errorLoad = ref(false)

const filterData = reactive({
  recordState: 0,
  pagination: {
    page: 1,
    rowsPerPage: Number(localStorage.getItem('pageSize')) || 10,
    rowsNumber: 1,
    totalCount: 1,
  },
})

const fields = computed(() => [
  { key: 'index', label: '№', class: 'text-center' },
  { key: 'pinfl', label: t('filters.pinfl'), class: 'text-center' },
  { key: 'firstName', label: t('filters.fio') },
  {
    key: 'passportInfo',
    label: t('userInfo.numberSeries'),
    class: 'text-center',
    formatter: (value: any) => value?.substring(0, 2) + ' ' + value?.slice(2),
  },
  { key: 'loanId', label: t('filters.contractId'), class: 'text-center' },
  {
    key: 'autopayAmount',
    label: t('autoPayAmount'),
    class: 'text-center',
    formatter: (value: any) => filters.filterMoney(value / 100),
  },
  {
    key: 'startDate',
    label: t('startDate'),
    class: 'text-center',
    formatter: (value: any) => filters.filterDateWithHM(value),
  },
  { key: 'stateName', label: t('status'), class: 'text-center' },
])

async function getActionList() {
  const data = await autopayFile.getActionList()
  actionList.value = data?.result
}

async function getFileInfoByFileId() {
  try {
    loading.value = true

    const data = await autopayFile.getFileInfoByFileId({
      RecordState: filterData.recordState,
      FileId: route.params.id,
      CurrentPage: filterData.pagination.page,
      PerPage: filterData.pagination.rowsPerPage,
    })

    fileList.value = data?.list
    filterData.pagination.rowsNumber = data?.totalPages
    filterData.pagination.totalCount = data?.totalCount

    numerationIndex.value =
      (filterData.pagination.page - 1) * filterData.pagination.rowsPerPage

    signIndex()
  } finally {
    loading.value = false
  }
}

const signIndex = () => {
  if (fileList.value.records.length) {
    fileList.value.records.forEach((record: any, index: any) => {
      record._rowVariant = record.state === 3 ? 'error-line' : record.state === 2 ? 'success-line' : 'info-line'
      if (filterData.pagination.page === 1) record.index = index + 1
      else record.index = numerationIndex.value + index + 1
    })
  }
}

async function downloadFile() {
  try {
    fileLoad.value = true
    const data = await filesStore.getFile({
      filePath: fileList.value.filePath,
    })
    download(data)
  } finally {
    fileLoad.value = false
  }
}

async function downloadErrors(fileId: number) {
  try {
    errorLoad.value = true
    const data = await autopayFile.downloadErrorByFileId(fileId)
    download(data)
  } finally {
    errorLoad.value = false
  }
}

async function downloadAll(fileId: number) {
  try {
    allLoad.value = true
    const data = await autopayFile.downloadSuccessByFileId(fileId)
    download(data)
  } finally {
    allLoad.value = false
  }
}

const download = (data: any) => {
  const downloadUrl = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.href = downloadUrl
  link.setAttribute(
    'download',
    `${fileList.value.fileName?.split('.')[0] || 'Файл'}.xlsx`
  ) //any other extension
  document.body.appendChild(link)
  link.click()
  link.remove()
}

onMounted(() => {
  getActionList()
  getFileInfoByFileId()
})
</script>

<template>
  <b-row class="table-list mb-3">
    <b-col>
      <TableFilters
        :filterData="filterData"
        :actionList="actionList"
        @emit:search="getFileInfoByFileId"
      />

      <div class="d-flex justify-content-between">
        <div class="mb-2">
          <b-button variant="warning" class="mb-1 px-5" @click="$router.go(-1)">
            {{ $t('btn_text.back') }}
          </b-button>
        </div>

        <div class="d-flex flex-wrap justify-content-end mb-2">
          <ExportBtn
            class="mb-1"
            :rows="fileList.records"
            :loadBtn="fileLoad"
            @emit:import="downloadFile"
          />

          <b-button
            v-if="fileList.errorCount > 0"
            variant="primary"
            class="ml-2 mb-1"
            :loading="errorLoad"
            loading-mode="fill"
            @click="downloadErrors(fileList.id)"
          >
            <i class="mdi mdi-download"></i> {{ $t('viewInfo.errorLoad') }}
          </b-button>

          <b-button
            variant="primary"
            class="ml-2 mb-1"
            :loading="allLoad"
            loading-mode="fill"
            @click="downloadAll(fileList.id)"
          >
            <i class="mdi mdi-download"></i> {{ $t('viewInfo.allLoad') }}
          </b-button>
        </div>
      </div>

      <b-card no-body class="card-box-shadow">
        <b-card-header
          class="align-items-center d-flex flex-wrap justify-content-between"
        >
          <TablePerPage
            :pagination="filterData.pagination"
            @emit:update="getFileInfoByFileId"
          />

          <h5>{{ 'Ishonch' }}</h5>
        </b-card-header>

        <div class="table-responsive mb-0">
          <b-table
            :items="fileList.records"
            :fields="fields"
            :busy="loading"
            :show-empty="!loading"
          >
            <template #table-busy>
              <div class="text-center text-primary my-2">
                <b-spinner class="align-middle mr-2"></b-spinner>
                <strong>{{ $t('loading') }}...</strong>
              </div>
            </template>

            <template #empty="scope">
              <h6 class="text-center text-muted py-2 mb-0">
                {{ $t('error.noData') }}
              </h6>
            </template>

            <template v-slot:cell(firstName)="{ item }">
              {{ item.firstName + ' ' + item.lastName }}
            </template>
          </b-table>
        </div>
      </b-card>

      <TablePagination
        :pagination="filterData.pagination"
        @emit:change="getFileInfoByFileId"
      />
    </b-col>
  </b-row>
</template>
