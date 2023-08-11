<script setup lang="ts">
import { useImportFileStore } from '@/stores/importFile'
import { computed, onMounted, reactive, ref } from 'vue'

import Moment from 'moment'
import filters from '@/filters'
import ImportFile from './Parts/ImportFile.vue'
import ListFilter from '@/components/Common/TableFilters.vue'
import TablePerPage from '@/components/Common/TablePerPage.vue'
import TablePagination from '@/components/Common/TablePagination.vue'

const files = ref([])
const loading = ref(false)
const numerationIndex = ref(1)
const importFileStore = useImportFileStore()

const universities = ref([{ id: null, name: 'ВУЗ', disabled: true }])

const filterData: any = reactive({
  university: null,
  startDate: Moment(new Date()).format('YYYY-MM-DD'),
  endDate: Moment(new Date()).format('YYYY-MM-DD'),
  pagination: {
    page: 1,
    totalCount: 0,
    rowsNumber: 1,
    rowsPerPage: Number(localStorage.getItem('pageSize')) || 30
  }
})

const fields = computed(() => [
  { key: 'index', label: '№', class: 'text-center' },
  { key: 'file_name', label: 'Файл' },
  { key: 'firstName', label: 'Пользователь', class: 'text-center' },
  { key: 'phone', label: 'Название Вуза', class: 'text-center' },
  { key: 'isActivate', label: 'Факультет/Отделение', class: 'text-center' },
  { key: 'isActivate', label: 'Кол-во записей', class: 'text-center' },
  { key: 'isActivate', label: 'Успешно обработано', class: 'text-center' },
  { key: 'isActivate', label: 'Статус', class: 'text-center' },
  { key: 'created_at', label: 'Дата', class: 'text-center',
    formatter: (val: any) => filters.filterDateAndTime(val)},
  { key: 'actions', label: 'Действие', class: 'text-center' },
])

async function getList() {
  try {
    loading.value = true

    const data = await importFileStore.getImportedFiles({
      currentPage: filterData.pagination.page,
      perPage: filterData.pagination.rowsPerPage
    })

    files.value = data?.results
    filterData.pagination.rowsNumber = Math.ceil(data?.total / data?.page_size)
    filterData.pagination.totalCount = data?.total

    numerationIndex.value = (filterData?.pagination.page - 1) * filterData?.pagination.rowsPerPage
    signIndex()
  } finally {
    loading.value = false
  }
}

const signIndex = () => {
  if (files.value?.length) {
    files.value.forEach((row: any, index) => {
      if (filterData.pagination.page === 1) row.index = index + 1
      else row.index = numerationIndex.value + index + 1
    })
  }
}

async function downloadFile(path: string) {
  try {
    loading.value = true
    const link = document.createElement('a')
    link.href = path
    link.setAttribute('download',`Файл.xlsx`) //any other extension
    document.body.appendChild(link)
    link.click()
    link.remove()
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getList()
})
</script>

<template>
  <b-row>
    <b-col lg="12">
      <ListFilter :filterData="filterData" :universities="universities" /> <!-- :noBtn="true" -->
    </b-col>

    <b-col lg="12" class="mb-3">
      <b-card no-body class="card-box-shadow">
        <b-card-header class="d-flex justify-content-between align-items-center">
          <h5 class="card-title mb-0">Загруженные файлы</h5>
          <ImportFile @emit:refresh="getList"/>
        </b-card-header>

        <div class="table-responsive mb-0">
          <div class="py-2 px-3">
            <TablePerPage
              :pagination="filterData.pagination"
              @emit:update="getList"
            />
          </div>

          <b-table
            :items="files"
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
              <h6 class="text-center text-muted py-2 mb-0">
                {{ $t('error.noData') }}
              </h6>
            </template>

            <template v-slot:cell(actions)="{ item }">
              <div class="d-flex justify-content-center">
                <i
                  v-if="item.file_to_export"
                  v-tooltip:bottom="'Скачать'"
                  @click="downloadFile(item.file_to_export)"
                  class="mdi mdi-tray-arrow-down text-success cup fs-22 ml-1"
                ></i>

                <i
                  class="mdi mdi-arrow-right-circle-outline text-primary cup fs-22 ml-1"
                  @click="$router.push({name: 'MainImportView', params: { id: item.id }})" 
                ></i>
              </div>
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
