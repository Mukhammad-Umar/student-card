<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { ref, reactive, computed, onMounted } from 'vue'
import { useAutopayFileStore } from '@/stores/autopayFile'

import filters from '@/filters'
import ExportBtn from '@/components/Common/ExportBtn.vue'
import TableFilters from '@/components/Common/TableFilters.vue'
import TablePerPage from '@/components/Common/TablePerPage.vue'
import TablePagination from '@/components/Common/TablePagination.vue'

const { t } = useI18n()
const route = useRoute()
const autopayFile = useAutopayFileStore()

const fileList: any = ref({})
const numerationIndex = ref(1)

const loading = ref(true)
const fileLoad = ref(false)

const filterData = reactive({
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
  { key: 'firstname', label: t('filters.fio') },
  { key: 'university_name', label: 'Название Вуза' },
  {
    key: 'serial_number',
    label: t('userInfo.numberSeries'),
    class: 'text-center',
    formatter: (value: any) => value?.substring(0, 2) + ' ' + value?.slice(2),
  },
  { key: 'faculty_name', label: 'Факультет/Отделение', class: 'text-center' },
  { key: 'phone', label: 'Номер телефона', class: 'text-center' },
  { key: 'status', label: t('status'), class: 'text-center' },
])

async function getFileInfoByFileId() {
  try {
    loading.value = true

    const data = await autopayFile.getFileInfoByFileId({
      upload_id: route.params.id,
      count: filterData.pagination.page,
      page_size: filterData.pagination.rowsPerPage,
    })

    fileList.value = data?.results
    filterData.pagination.rowsNumber = Math.ceil(data?.total / data?.page_size)
    filterData.pagination.totalCount = data?.total

    numerationIndex.value = (filterData.pagination.page - 1) * filterData.pagination.rowsPerPage
    signIndex()
  } finally {
    loading.value = false
  }
}

const signIndex = () => {
  if (fileList.value.length) {
    fileList.value.forEach((record: any, index: any) => {
      // record._rowVariant = record.state === 3 ? 'error-line' : record.state === 2 ? 'success-line' : 'info-line'
      if (filterData.pagination.page === 1) record.index = index + 1
      else record.index = numerationIndex.value + index + 1
    })
  }
}

async function downloadFile(path: string) {
  try {
    fileLoad.value = true
    const link = document.createElement('a')
    link.href = path
    link.setAttribute('download',`Файл.xlsx`) //any other extension
    document.body.appendChild(link)
    link.click()
    link.remove()
  } finally {
    fileLoad.value = false
  }
}

onMounted(() => getFileInfoByFileId())
</script>

<template>
  <b-row class="table-list mb-3">
    <b-col>
      <TableFilters
        :filterData="filterData"
        @emit:search="getFileInfoByFileId"
      />

      <div class="d-flex justify-content-between">
        <div class="mb-2">
          <b-button variant="warning" class="mb-1 px-5" @click="$router.go(-1)">
            {{ $t('btn_text.back') }}
          </b-button>
        </div>

        <div class="d-flex flex-wrap justify-content-end mb-2">
          <b-button class="mb-1" variant="primary">
            Перезапуск реестра
          </b-button>

          <b-button class="ml-2 mb-1" variant="primary">
            Отправить на печать
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

          <div class="table-count-info d-flex align-items-center ms-auto">
            <span class="fs-14 border-end text-right pr-2">
              Файл: {{ 'template.xls' }}
            </span>
            <span class="fs-14 border-end text-right pr-2 ml-2">
              Всего: {{ filters.filterMoney(1000) }}
            </span>
            <span class="fs-14 border-end text-right pr-2 ml-2">
              Обработаны успешно: {{ filters.filterMoney(700) }}
            </span>
            <span class="fs-14 ml-2 text-right">
              Ошибки: {{ filters.filterMoney(300) }}
            </span>
          </div>
        </b-card-header>

        <div class="table-responsive mb-0">
          <b-table
            :items="fileList"
            :fields="fields"
            :busy="loading"
            :show-empty="!loading"
            class="import-view-table"
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

            <template v-slot:cell(firstname)="{ item }">
              <span>{{ item.lastname + ' ' + item.firstname + ' ' + item.fathername }}</span>
            </template>

            <template v-slot:cell(status)="{ item }">
              <b-badge :variant="item.status === 'SUCCESS' ? 'success' : 'danger'" class="fs-11">
                {{ item.status === 'SUCCESS' ? 'Готов к печати' : 'Отклонена' }}
              </b-badge>
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
